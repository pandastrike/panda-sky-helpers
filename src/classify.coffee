import {flow} from "panda-garden"
import {include, toLower, toUpper, toJSON, fromJSON, isEmpty, merge, keys} from "panda-parchment"
import {yaml} from "panda-serialize"
import Template from "url-template"
import Accept from "@hapi/accept"
import AJV from "ajv"
import {parse as parseAuthorization} from "panda-auth-header"
import {confidential} from "panda-confidential"

import {ungzip} from "./compress"
import {defaultCORS} from "./cors"
import responses from "./responses"
{NoContent, BadRequest, NotFound, MethodNotAllowed, NotAcceptable, UnsupportedMediaType, Unauthorized, UnsupportedMediaType} = responses

ajv = new AJV()
{Declaration, verify} = confidential()

metrics = (context) ->

  console.log
    raw:
      path: context.request.path
      query: context.request.queryStringParameters
      method: context.request.httpMethod
      headers:
        accept: context.request.headers.accept
        "accept-encoding": context.request.headers["accept-encoding"]
        "accept-language": context.request.headers["accept-language"]
        "user-agent": context.request.headers["user-agent"]

  context

assembleURL = (context) ->
  {path, queryStringParameters, headers, httpMethod} = context.request

  # ALB separates the qs parameters from URL. Reattach.
  if isEmpty queryStringParameters
    url = path
  else
    querystring = ""
    for key, value of queryStringParameters
      querystring += "&#{key}=#{value}"
    url = "#{path}?#{querystring[1...]}"

  context.match = {url, headers, method: httpMethod}
  context

matchURL = (context) ->
  unless (route = context.router.match context.match.url)?
    throw new NotFound()
  else
    # To make sure qs ordering is consistent, use template to remake the URL.
    template = Template.parse route.data.template
    context.match.url = template.expand route.bindings
    include context.match, route
    context

matchOPTIONS = (context) ->
  {method, data} = context.match
  if method == "OPTIONS"
    throw new NoContent "CORS preflight", merge defaultCORS,
      "Access-Control-Max-Age": "86400"
      "Access-Control-Allow-Methods": do ->
        (toUpper key for key in keys data.methods).join ", "
  else
    context

matchMethod = (context) ->
  {method, data} = context.match
  unless (def = data.methods[toLower method])?
    throw new MethodNotAllowed()
  else
    {signatures, hints} = def
    include context.match, {signatures, hints}
    context

matchAccept = (context) ->
  {signatures, headers} = context.match

  # Negotiate content type by comparing client and our preferences.
  if preferences = signatures.response.mediatype
    header = headers.accept || "*/*"

    try
      acceptable = Accept.mediaType header, preferences
    catch e
      console.warn e
      throw new NotAcceptable "supported: #{toJSON preferences, true}"

    if isEmpty acceptable
      throw new NotAcceptable "supported: #{toJSON preferences, true}"
    else
      context.match.accept = acceptable

  # Negotiate content encoding by comparing client and our preferences.
  if preferences = signatures.response.encoding
    header = headers["accept-encoding"] || ""

    try
      acceptable = Accept.encoding header, preferences
    catch e
      console.warn e
      throw new NotAcceptable "supported: #{toJSON preferences, true}"

    if isEmpty acceptable
      throw new NotAcceptable "supported: #{toJSON preferences, true}"
    else
      context.match.acceptEncoding = acceptable

  context

matchContent = (context) ->
  {headers, signatures} = context.match
  {body} = context.request
  type = headers["content-type"]
  encoding = headers["content-encoding"]

  if signatures.request.signed
    try
      declaration = Declaration.from "base64", fromJSON body
      result = verify declaration
    catch e
      console.warn e
      throw new BadRequest "signed body failed verification"

    if result
      context.match.declaration = declaration
      body = declaration.message.to "utf8"
    else
      throw new BadRequest "signed body failed verification"



  allowed = signatures.request.mediatype
  if allowed && (type not in allowed)
    throw new UnsupportedMediaType "supported response types: #{toJSON allowed}"

  switch encoding
    when undefined, "identity" then break
    when "gzip" then body = await ungzip body
    else
      throw new UnsupportedMediaType "no support for request content encoding #{encoding}"

  switch type
    when undefined
      unless isEmpty body
        throw new UnsupportedMediaType "request contains a non-empty body, but no content-type header"
    when "application/json" then body = fromJSON body
    when "text/yaml" then body = yaml body

  if signatures.request.schema
    unless ajv.validate signatures.request.schema, body
      console.warn toJSON ajv.errors, true
      throw new BadRequest ajv.errors

  context.match.body = body
  context

matchAuthorization = (context) ->
  {headers, signatures, hints} = context.match

  if hints? && ("edge authorization" in hints)
    return context

  if allowedScheme = context.match.signatures.request.authorization
    unless header = headers.authorization
      throw new Unauthorized "authorization header required"
    else
      {scheme, params, token} = parseAuthorization header
      include context.match, authorization: {scheme, token, params}

  context

matchCache = (context) ->
  {headers, signatures} = context.match

  unless signatures.response.cache
    return context

  context.match.cache =
    etag: headers["if-none-match"]
    timestamp: headers["if-modified-since"]

  context

classify = flow [
  metrics
  assembleURL
  matchURL
  matchOPTIONS
  matchMethod
  matchAccept
  matchContent
  matchAuthorization
  matchCache
]

export default classify

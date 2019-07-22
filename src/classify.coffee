import {flow} from "panda-garden"
import {include, toLower, toJSON, fromJSON, isEmpty} from "panda-parchment"
import {yaml} from "panda-serialize"
import Accept from "@hapi/accept"
import AJV from "ajv"
import {parse as parseAuthorization} from "panda-auth-header"

import {ungzip} from "./compress"
import log from "./logger"
import responses from "./responses"
{BadRequest, NotFound, MethodNotAllowed, NotAcceptable, UnsupportedMediaType, Unauthorized, UnsupportedMediaType} = responses

ajv = new AJV()

metrics = (context) ->
  await log.debug
    path: context.request.path
    query: context.request.queryStringParameters
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
    include context.match, route
    context

matchMethod = (context) ->
  {method, data} = context.match
  unless (def = data.methods[toLower method])?
    throw new MethodNotAllowed()
  else
    {signatures, partition} = def
    include context.match, {signatures, partition}
    context

matchAccept = (context) ->
  {signatures, headers} = context.match

  # Negotiate content type by comparing client and our preferences.
  preferences = signatures.response.mediatype || ["application/json"]
  header = headers.accept || "*/*"
  acceptable = Accept.mediaType header, preferences
  if isEmpty acceptable
    throw new NotAcceptable "supported: #{toJSON preferences, true}"
  else
    context.match.accept = acceptable

  # Negotiate content encoding by comparing client and our preferences.
  preferences = ["gzip", "identity"]
  header = headers["accept-encoding"] || ""
  acceptable = Accept.encoding header, preferences
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
    else
      throw new UnsupportedMediaType "no support for request content type #{type}"

  if signatures.request.schema
    unless ajv.validate signatures.request.schema, body
      log.warn toJSON ajv.errors, true
      throw new BadRequest ajv.errors

  context.match.body = body
  context

matchAuthorization = (context) ->
  {headers, signatures} = context.match

  if allowedScheme = context.match.signatures.request.authorization
    unless header = headers.authorization
      throw new Unauthorized "authorization header required"
    else
      {scheme, params, token} = parseAuthorization header
      if token
        include context.match, authorization: {scheme, token}
      else
        include context.match, authorization: {scheme, params}

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
  matchMethod
  matchAccept
  matchContent
  matchAuthorization
  matchCache
]

export default classify

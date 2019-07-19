import {flow} from "panda-garden"
import {include, toLower, empty, toJSON, fromJSON} from "panda-parchment"
import Accept from "accept"
import AJV from "ajv"
import {parse as parseAuthorization} from "panda-auth-header"

import log from "./logger"
import {BadRequest, NotFound, MethodNotAllowed, NotAcceptable, UnsupportedMediaType, Unauthorized} from "./responses"

ajv = new Ajv()

matchURL = (context) ->
  unless match = context.router.match context.request.path
    throw new NotFound()
  else
    include context, {match}
    context

assembleRequest = (context) ->
  {request:{path, queryStringParameters, headers, body, httpMethod}} = context

  # ALB separates the qs parameters from URL. Reattach.
  if empty queryStringParameters
    url = path
  else
    querystring = ""
    for key, value of queryStringParameters
      querystring += "&#{key}=#{value}"
    url += "#{path}?#{querystring[1...]}"

  # TODO: Support more than just JSON
  if empty body
    body = {}
  else
    body = fromJSON body

  include context.match, {url, headers, body, method: httpMethod}
  context

matchMethod = (context) ->
  {{method, data}} = context.match
  unless signatures = data.methods[toLower method]?.signatures
    throw new MethodNotAllowed()
  else
    include context.match, {signatures}
    context

matchAccept = (context) ->
  {signatures, headers} = context.match

  # Negotiate content type by comparing client and our preferences.
  preferences = signatures.response.mediatype || ["application/json"]
  header = headers.accept || "*/*"
  acceptable = Accept.mediaType header, preferences
  if empty acceptable
    throw new NotAcceptable "supported: #{toJSON preferences, true}"
  else
    context.match.accept = acceptable

  # Negotiate content encoding by comparing client and our preferences.
  preferences = ["gzip", "identity"]
  header = headers["accept-encoding"] || ""
  acceptable = Accept.encoding header, preferences
  if empty acceptable
    throw new NotAcceptable "supported: #{toJSON preferences, true}"
  else
    context.match.acceptEncoding = acceptable

  context

matchContent = (context) ->
  {{headers, body, signatures}} = context.match

  type = headers["content-type"]
  allowed = signatures.request.mediatype
  if allowed && (type not in allowed)
    throw new UnsupportedMediaType "supported: #{toJSON allowed}"

  # TODO: Allow this to support more than just application/json
  if {schema} = signatures.request
    unless ajv.validate schema, body
      log.warn toJSON ajv.errors, true
      throw new BadRequest ajv.errors

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

classify = flow [
  matchURL
  assembleRequest
  matchMethod
  matchAccept
  matchContent
  matchAuthorization
]

export default classify

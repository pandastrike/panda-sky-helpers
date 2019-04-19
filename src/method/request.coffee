import {parse} from "panda-auth-header"
import {mediaType, encoding} from "accept"
import AJV from "ajv"
import {empty, merge, include, toJSON} from "panda-parchment"
import log from "../logger"
import Cache from "./cache"
import responses from "../responses"
{UnsupportedMediaType, UnprocessableEntity, NotAcceptable} = responses
ajv = new AJV()

accept = (signatures) ->
  ({request, response}) ->
    # Negotiate content type by comparing client and our preferences.
    preferences = signatures.response.mediatype || ["application/json"]
    header = request.headers?["accept"] || "*/*"
    match = mediaType header, preferences
    if empty match
      throw new NotAcceptable "the following types are supported: #{toJSON preferences}"
    else
      response.type = match

    # Negotiate content encoding by comparing client and our preferences.
    preferences = ["identity", "gzip"]
    header = request.headers?["accept-encoding"] || ""
    match = encoding header, preferences
    if empty match
      throw new NotAcceptable "the following encodings are supported: #{toJSON preferences}"

    # The Content-Encoding header and relevant compression is set by Gateway
    # So there is no response field to set here.

authorization = ({request}) ->
  return unless request.headers?

  if request.headers?.Authorization?
    request.headers.authorization = request.headers.Authorization

  if (header = request.headers.authorization)?
    {scheme, params, token} = parse header
    if token
      request.authorization = {scheme, token}
    else
      request.authorization = {scheme, params}

cache = (signatures) ->
  ({request}) ->
    request.cache = new Cache signatures, request

# Re-assign the request object to become the response.
execute = (handler) ->
  ({request, response}) ->
    include response,
      data: await handler request, response
    include response,
      metadata:
        headers: "Content-Type": response.type

# Standard logging for all requests for debugging / anonymous stats.
metrics = ({request, response}) ->
  log.debug
    path: request.path
    headers:
      accept: request.headers.accept
      "accept-encoding": request.headers["accept-encoding"]
      "accept-language": request.headers["accept-language"]
      "user-agent": request.headers["user-agent"]

schema = (signatures) ->
  ({request}) ->
    type = request.headers?["content-type"]
    allowed = signatures.request.mediatype
    if allowed && type not in allowed
      throw new UnsupportedMediaType "content must be type(s) #{toJSON allowed}"

    if (_schema = signatures.request.schema)?
      _schema = merge
        $schema: "http://json-schema.org/draft-07/schema#"
        $id: "http://example.com/product.schema.json"
        title: "Handler Schema"
        description: "Schema for the content in the body of this HTTP request."
        type: "object"
        , _schema

      isValid = ajv.validate _schema, (request.content || {})
      if !isValid
        log.warn ajv.errors
        out = {}
        for error in ajv.errors
          out[error.dataPath] =
            path: error.schemaPath
            violations: error.params
        throw new UnprocessableEntity toJSON out

export {
  authorization
  accept
  cache
  execute
  metrics
  schema
}

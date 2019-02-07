import {parse} from "panda-auth-header"
import {mediaTypes} from "accept"
import AJV from "ajv"
import {intersection, empty, first, merge} from "panda-parchment"
import log from "../logger"
import Cache from "./cache"
import responses from "../responses"
{UnsupportedMediaType, UnprocessableEntity} = responses
ajv = new AJV()

schema = (signatures) ->
  (request) ->
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
        throw new UnprocessableEntity JSON.stringify out

accept = (signatures) ->
  (request) ->

    if !(allowed = signatures.response.mediatype)?
      request.accept = "application/json"
      return

    # array in order of preference, matches maintains that order.
    types = mediaTypes request.headers?.Accept || request.headers?.accept
    matches = intersection allowed, types
    if empty matches
      if "*/*" in types
        return request.accept = "application/json"
      throw new UnsupportedMediaType types.join ", "
    request.accept = first matches

authorization = (request) ->
  return unless request.headers?

  if request.headers?.Authorization?
    request.headers.authorization = request.headers.Authorization

  if (header = request.headers.authorization)?
    {scheme, params, token} = parse header
    if token
      request.authorization = {scheme, token}
    else
      request.authorization = {scheme, params}

cache = (request) ->
  request.cache = new Cache request

# Re-assign the request object to become the response.
execute = (handler) ->
  (request) ->
    request.response =
      data: await handler request
      metadata:
        headers:
          "Content-Type": request.accept

export {
  authorization
  accept
  cache
  execute
  schema
}

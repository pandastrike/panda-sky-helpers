import {parse} from "panda-auth-header"
import {mediaTypes} from "accept"
import {intersection, empty, first} from "panda-parchment"
import Cache from "./cache"
import responses from "../responses"
{UnsupportedMediaType} = responses

authorization = (request) ->
  header = request.headers?.Authorization || request.headers?.authorization
  if header?
    {scheme, params, token} = parse header
    if token
      request.authorization = {scheme, token}
    else
      request.authorization = {scheme, params}
  request

accept = (signatures, request) ->
  allowed = signatures.response.mediatype
  # array in order of preference
  types = mediaTypes request.headers?.Accept || request.headers?.accept
  if "*/*" in types
    # TODO: Revisit this convention.
    request.accept = "application/json"
    return request

  matches = intersection allowed, types # matches maintains preference order
  if empty matches
    throw new UnsupportedMediaType types.join ", "
  request.accept = first matches
  request

cache: (request) ->
  request.cache = new Cache request
  request

export {
  authorization
  accept
  cache
}

import {md5} from "../utils"

stamp = (signatures) ->
  ({response, cache}) ->
    definition = signatures.response.cache

    return response if !definition?

    if definition.maxAge == "manual"
      response.metadata.headers["Cache-Control"] = "max-age=#{cache?.maxAge}"
    else
      response.metadata.headers["Cache-Control"] = "max-age=#{definition.maxAge}"

    if definition.lastModified
      response.metadata.headers["Last-Modified"] = cache?.timestamp

    if definition.etag
      response.metadata.headers.ETag = cache?.etag || md5 response.data

location = ({response, location}) ->
  if location
    response.metadata.headers.Location = location

capability = ({response, capability}) ->
  if capability
    response.metadata.headers.Capability = capability

export {stamp, location, capability}

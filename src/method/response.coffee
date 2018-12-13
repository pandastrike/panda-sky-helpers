import {md5} from "../utils"

stamp = (signatures) ->
  ({response}) ->
    definition = signatures.response.cache
    out = response.cache

    return response if !definition?

    if definition.maxAge == "manual"
      response.metadata.headers["Cache-Control"] = "max-age=#{out?.maxAge}"
    else
      response.metadata.headers["Cache-Control"] = "max-age=#{definition.maxAge}"

    if definition.lastModified
      response.metadata.headers["Last-Modified"] = out?.timestamp

    if definition.etag
      response.metadata.headers.ETag = out?.etag || md5 response.data

export {stamp}

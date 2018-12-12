import {md5} from "../utils"

Response =

  stamp: (signatures, response) ->
    definition = signatures.response.cache
    out = response.cache

    return response if !definition?

    if definition.maxAge == "manual"
      metadata.headers["Cache-Control"] = "max-age=#{out?.maxAge}"
    else
      metadata.headers["Cache-Control"] = "max-age=#{definition.maxAge}"

    if definition.lastModified
      metadata.headers["Last-Modified"] = out?.timestamp

    if definition.etag
      metadata.headers.ETag = out?.etag || md5 response.data

export default Response

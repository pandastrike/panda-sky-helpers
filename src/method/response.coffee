
stamp = (signatures) ->
  ({request:{cache}, response}) ->
    return response unless cache.isPresent

    response.metadata.headers["Cache-Control"] = "max-age=#{cache.maxAge}"
    response.metadata.headers["Vary"] = "Accept, Accept-Encoding"

    if cache.lastModified?
      response.metadata.headers["Last-Modified"] = cache?.timestamp

    if cache.etag?
      response.metadata.headers["ETag"] = cache.etag


location = ({request:{location}, response}) ->
  if location
    response.metadata.headers.Location = location

capability = ({request:{capability}, response}) ->
  if capability
    response.metadata.headers.Capability = capability

export {stamp, location, capability}

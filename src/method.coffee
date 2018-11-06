import Crypto from "crypto"
import {parse} from "panda-auth-header"
import log from "./logger"
import responses from "./responses"
{NotModified} = responses

md5 = (obj) ->
  Crypto.createHash('md5').update(JSON.stringify(obj), 'utf-8').digest("hex")

class Cache
  constructor: (request) ->
    log.debug "Cache Headers:", request.headers
    @timestamp = null
    @inputTime = request.headers?["if-modified-since"] || request.headers?["If-Modified-Since"]
    @inputETag = request.headers?["if-none-match"] || request.headers?["If-None-Match"]

  timeCheck: (timestamp) ->
    timestamp = new Date(Number timestamp).toUTCString()
    if timestamp == @inputTime
      throw new NotModified()
    else
      @timestamp = timestamp

  hashCheck: (content) ->
    etag = md5 content
    if etag == @inputETag
      throw new NotModified()
    else
      @etag = etag
    content

  setMaxAge: (maxAge) -> @maxAge = maxAge

method = (signatures, handler) ->
  # TODO: parse Accept header
  (request, context) ->
    if request.source == "cuddle-monkey"
      log.debug "Detected a Cuddle Monkey preheater invocation. Short circuting request cycle."
      return true

    if (header = request.headers?['Authorization'])?
      {scheme, params, token} = parse header
      if token
        request.authorization = {scheme, token}
      else
        request.authorization = {scheme, params}

    # Process the handler while minding the conditional cache headers.
    if !signatures.response.cache
      return data: await handler request, context

    {maxAge, lastModified, etag} = signatures.response.cache
    cache = new Cache request
    data = await handler request, context, cache
    metadata = headers: {}
    if maxAge == "manual"
      metadata.headers["Cache-Control"] = "max-age=#{cache.maxAge}"
    else
      metadata.headers["Cache-Control"] = "max-age=#{maxAge}"
    if lastModified
      metadata.headers["Last-Modified"] = cache.timestamp
    if etag
      metadata.headers.ETag = cache.etag || md5 data

    return {data, metadata}

export default method

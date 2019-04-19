import {isString, toJSON} from "panda-parchment"
import {md5} from "../utils"
import responses from "../responses"
{NotModified} = responses

class Cache
  constructor: (signatures, request) ->
    {cache} = signatures.response
    if cache?
      @isPresent = true
    else
      @isPresent = false
      return

    @maxAge = cache.maxAge
    @etag = null
    @timestamp = null
    @inputTime = request.headers?["if-modified-since"]
    @inputETag = request.headers?["if-none-match"]
    @vary = "Accept, Accept-Encoding"

  timeCheck: (timestamp) ->
    @timestamp = new Date(Number timestamp).toUTCString()
    if timestamp == @inputTime
      error = new NotModified()
      error.metadata = headers:
        "Last-Modified": @timestamp
        "Cache-Control": "max-age=#{@maxAge}"
        Vary: @vary
      throw error

  hashCheck: (content) ->
    @etag = md5 if isString content then content else toJSON content
    if @etag == @inputETag
      error = new NotModified()
      error.metadata = headers:
        ETag: @etag
        "Cache-Control": "max-age=#{@maxAge}"
        Vary: @vary
      throw error
    else
      content

  setMaxAge: (maxAge) -> @maxAge = maxAge
  setEtag: (content) ->
    @etag = md5 if isString content then content else toJSON content
  setTime: (timestamp) -> @timestamp = new Date(Number timestamp).toUTCString()

export default Cache

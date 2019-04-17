import {md5} from "../utils"
import responses from "../responses"
{NotModified} = responses

class Cache
  constructor: (request) ->
    @timestamp = null
    @inputTime = request.headers?["if-modified-since"] || request.headers?["If-Modified-Since"]
    @inputETag = request.headers?["if-none-match"] || request.headers?["If-None-Match"]

  timeCheck: (timestamp) ->
    timestamp = new Date(Number timestamp).toUTCString()
    if timestamp == @inputTime
      error = new NotModified()
      error.metadata = headers: {"Last-Modified": timestamp}
      throw error
    else
      @timestamp = timestamp

  hashCheck: (content) ->
    etag = md5 content
    if etag == @inputETag
      error = new NotModified()
      error.metadata = headers: {ETag: etag}
      throw error
    else
      @etag = etag
    content

  setMaxAge: (maxAge) -> @maxAge = maxAge

export default Cache

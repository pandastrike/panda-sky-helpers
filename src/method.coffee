import Crypto from "crypto"
import {parse} from "panda-auth-header"
import log from "./logger"
import responses from "./responses"
{NotModified} = responses

md5 = (obj) ->
  Crypto.createHash('md5').update(JSON.stringify(obj), 'utf-8').digest("hex")

class Cache
  constructor: (request) ->
    @timestamp = null
    @inputTime = request.headers?["if-modified-since"]

  check: (timestamp) ->
    timestamp = new Date(Number timestamp).toUTCString()
    if timestamp == @inputTime
      throw new NotModified()
    else
      @timestamp = timestamp

method = (signatures, handler) ->
  # TODO: parse Accept header
  (request, context) ->
    if request.source == "cuddle-monkey"
      log.info "Detected a Cuddle Monkey preheater invocation. Short circuting request cycle."
      return true

    if (header = request.headers?['Authorization'])?
      {scheme, params, token} = parse header
      if token
        request.authorization = {scheme, token}
      else
        request.authorization = {scheme, params}

    # Process the handler while minding the conditional cache headers.
    if signatures.response.cache?.lastModified
      log.debug "incoming headers for Last-Modified", request.headers
      cache = new Cache request
      data = await handler request, context, cache
      console.log cache
      return
        data: data
        metadata: headers: lastModified: cache.timestamp

    else if signatures.response.cache?.etag
      log.debug "incoming headers for ETag", request.headers
      data = await handler request, context
      etag = md5 data
      if request.headers?["if-none-match"] == etag
        throw new NotModified()
      return
        data: data
        metadata: headers: {etag}

    else
      data: await handler request, context

export default method

import {resolve} from "path"
import {flow} from "panda-garden"
import {first, include, fromJSON, toJSON, isString, dashed, toLower, microseconds} from "panda-parchment"
import Responses from "./responses"
import {md5, hashCheck, toString} from "./cache"
import {matchCORS} from "./cors"
import {isCompressible, gzip} from "./compress"

execute = (context) ->
  {handlers, match:{data:{resource}, method}} = context
  console.log resource, method

  unless f = handlers[dashed resource][toLower method]
    throw new Responses.NotImplemented "no handler for #{resource} #{method}"

  await f context

matchEncoding = (context) ->
  {mediatype} = context.match.signatures.response
  {body, encodeReady} = context.response

  if mediatype && body? && !encodeReady
    switch context.match.acceptEncoding
      when "identity"
        context.response.body = toJSON body unless isString body
        context.response.headers["Content-Encoding"] = "identity"
        context.response.isBase64Encoded = false
      when "gzip"
        buffer = Buffer.from (toString body), "utf8"
        if isCompressible buffer, context.match.accept
          context.response.body = await gzip buffer
          context.response.isBase64Encoded = true
        else
          context.match.acceptEncoding = "identity"
          context = matchEncoding context
      else
        throw new Error "Bad encoding: #{context.match.acceptEncoding}"

  context

matchCache = (context) ->
  {response:{body}, match} = context

  if current = hashCheck match, body
    include context.response.headers, ETag: current

  if (cache = match.signatures.response.cache)?
    {maxAge, sharedMaxAge} = cache
    if maxAge? && sharedMaxAge?
      include context.response.headers,
        "Cache-Control": "max-age=#{maxAge}, s-maxage=#{sharedMaxAge}"
    else if maxAge?
      include context.response.headers,
        "Cache-Control": "max-age=#{maxAge}"
    else if sharedMaxAge?
      include context.response.headers,
        "Cache-Control": "s-maxage=#{sharedMaxAge}"

  context

matchStatus = (context) ->
  code = first context.match.signatures.response.status
  include context.response, {code}, tag: Responses[code]
  context

matchHeaders = (context) ->
  {accept, acceptEncoding, signatures} = context.match

  if signatures.response.mediatype
    include context.response.headers,
      "Content-Type": accept
      "Content-Encoding": acceptEncoding
      Vary: "Accept, Accept-Encoding"

  context




stamp = flow [
  matchEncoding
  matchCache
  matchStatus
  matchCORS
  matchHeaders
]

respond = (context) ->
  {match:{data:{resource}, method}} = context
  console.log "#{resource}#{method}Dispatch":
    (microseconds() - context.start) / 1000

  {code, tag, headers, body, isBase64Encoded=false} = context.response

  statusCode: code
  statusDescription: tag
  headers: headers
  body: body
  isBase64Encoded: isBase64Encoded

dispatch = flow [
  execute
  stamp
  respond
]

export default dispatch

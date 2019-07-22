import SDK from "aws-sdk"
import Sundog from "sundog"
import {flow} from "panda-garden"
import {first, include, fromJSON, toJSON, isString} from "panda-parchment"
import env from "./env"
import logger from "./logger"
import Responses from "./responses"
import {md5} from "./cache"
import {matchCORS} from "./cors"
import {isCompressible, gzip} from "./compress"

{invoke} = Sundog(SDK).AWS.Lambda()

execute = (context) ->
  {partition} = context.match

  name = "#{env.name}-#{env.environment}-#{partition}"
  logger.debug "Dispatching to lambda '#{name}'"
  {Payload} = await invoke name, context
  context.response = (fromJSON Payload.toString()).response
  context

matchCache = (context) ->
  {response, match} = context

  if ({cache} = match.signatures.response)?
    {maxAge, etag} = cache
    include context.response.headers,
      "Cache-Control": "max-age=#{maxAge}" if maxAge
      ETag: md5 response.body if etag

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


matchEncoding = (context) ->
  {mediatype} = context.match.signatures.response
  {body, encodeReady} = context.response

  if mediatype && !encodeReady
    switch context.match.acceptEncoding
      when "identity" then break
      when "gzip"
        buffer = Buffer.from (toJSON body), "utf8"
        if isCompressible buffer, context.match.accept
          context.response.body = await gzip buffer
          context.response.isBase64Encoded = true
        else
          context.response.headers["Content-Encoding"] = "identity"
      else
        throw new Error "Bad encoding: #{context.match.acceptEncoding}"

  context

stamp = flow [
  matchCache
  matchStatus
  matchCORS
  matchHeaders
  matchEncoding
]

respond = ({response}) ->
  {code, tag, headers, body, isBase64Encoded=false} = response

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

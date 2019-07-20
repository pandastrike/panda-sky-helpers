import zlib from "zlib"
import SDK from "aws-sdk"
import Sundog from "sundog"
import {flow} from "panda-garden"
import {first, include, toJSON, isString} from "panda-parchment"
import env from "./env"
import logger from "./logger"
import {md5} from "./cache"
import {matchCORS} from "./cors"
import Responses from "./responses"

{invoke} = Sundog(SDK).AWS.Lambda()

gzip = (buffer) ->
  new Promise (resolve, reject) ->
    zlib.gzip buffer, (error, result) ->
      if error
        reject error
      else
        resolve result.toString "base64"

execute = (context) ->
  {partition} = context.match

  name = "#{env.name}-#{env.environment}-#{partition}"
  logger.debug "Dispatching to lambda '#{name}'"
  await inovke name, context

matchCache = (context) ->
  {response, match} = context
  {maxAge, etag} = match.signatures.response.cache

  include context.response.headers
    Vary: "Accept, Accept-Encoding" if maxAge
    "Cache-Control": "max-age=#{maxAge}" if maxAge
    ETag: md5 response.body if etag

  context

matchStatus = (context) ->
  code = first context.match.signatures.response.status
  include context.response, {code}, tag: Response code
  context

matchHeaders = (context) ->
  {accept, acceptEncoding, signatures} = context.match

  if signatures.response.mediatype
    include context.response.headers,
      "Content-Type": accept
      "Content-Encoding": acceptEncoding

  context


matchEncoding = (context) ->
  {body} = context.response

  if body?
    switch context.match.acceptEncoding
      when "identity" then break
      when "gzip"
        buffer = Buffer.from (toJSON body), "utf8"
        if buffer.length < 1000
          context.response.headers["Content-Encoding"] = "identity"
        else
          context.response.body = await gzip buffer
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

respond = ({response, callback}) ->
  {code, tag, headers, body} = response
  callback null,
    statusCode: code
    statusDescription: tag
    headers: headers
    body: body

dispatch = flow [
  execute
  stamp
  respond
]

export default dispatch

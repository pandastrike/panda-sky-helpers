import Crypto from "crypto"
import {isString, toJSON} from "panda-parchment"
import responses from "./responses"
{NotModified} = responses

# TODO: Make this sensitive to encoding that are not utf-8.
md5 = (str) ->
  Crypto.createHash("md5").update(str, "utf8").digest("hex")

toString = (x) -> if isString x then x else toJSON x

timeCheck = (match, value) ->
  return unless match.signatures.response.cache?.etag && value?

  timestamp = match.cache?.timestamp
  maxAge = match.signatures.response.cache?.maxAge

  headers =
    "Last-Modified": timestamp
    "Cache-Control": "max-age=#{maxAge}" if maxAge
    Vary: "Accept, Accept-Encoding"

  if timestamp == new Date(value).toUTCString()
    throw new NotModified null, headers

hashCheck = (match, content) ->
  return unless match.signatures.response.cache?.etag && content?

  etag = match.cache?.etag
  maxAge = match.signatures.response.cache?.maxAge

  headers =
    ETag: etag
    "Cache-Control": "max-age=#{maxAge}" if maxAge
    Vary: "Accept, Accept-Encoding"

  current = md5 toString content

  if etag == current
    throw new NotModified null, headers
  else
    current

checks =
  time: timeCheck
  hash: hashCheck

export {md5, toString, timeCheck, hashCheck, checks}

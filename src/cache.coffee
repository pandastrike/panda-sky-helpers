import Crypto from "crypto"
import {isString, toJSON} from "panda-parchment"
import responses from "./responses"
{NotModified} = responses

# TODO: Make this sensitive to encoding that are not utf-8.
md5 = (str) ->
  Crypto.createHash("md5").update(str, "utf8").digest("hex")

timeCheck = (match, value) ->
  {timestamp} = match.cache
  {maxAge} = match.signature.response.cache
  headers =
    "Last-Modified": timestamp
    "Cache-Control": "max-age=#{maxAge}" if maxAge
    Vary: "Accept, Accept-Encoding"

  if timestamp == new Date(value).toUTCString()
    throw new NotModified null, headers

hashCheck = (match, content) ->
  {etag} = match.cache
  {maxAge} = match.signature.response.cache
  headers =
    ETag: etag
    "Cache-Control": "max-age=#{maxAge}" if maxAge
    Vary: "Accept, Accept-Encoding"

  if etag == (md5 if isString content then content else toJSON content)
    throw new NotModified null, headers

export {md5, timeCheck, hashCheck}

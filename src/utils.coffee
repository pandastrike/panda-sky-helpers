import zlib from "zlib"
import Crypto from "crypto"
import {toJSON} from "panda-parchment"

# TODO: Make this sensitive to encoding that are not utf-8.
md5 = (str) ->
  Crypto.createHash("md5").update(str, "utf8").digest("hex")

oneShot = ([request, fx...]) ->
  await f request for f in fx
  request

encode = (type, data) ->
  switch type
    when "identity"
      {data}
    when "gzip"
      binaryData: await new Promise (resolve, reject) ->
        zlib.gzip (Buffer.from (toJSON data), "utf8"), (error, result) ->
          if error
            reject error
          else
            resolve result.toString "base64"
    else
      throw new Error "Undefined response encoding, #{type}"

export {md5, oneShot, encode}

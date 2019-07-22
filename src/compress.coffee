import zlib from "zlib"

gzip = (buffer) ->
  new Promise (resolve, reject) ->
    zlib.gzip buffer, level: 1, (error, result) ->
      if error
        reject error
      else
        resolve result.toString "base64"

ungzip = (string, encoding="utf8") ->
  new Promise (resolve, reject) ->
    zlib.gunzip (Buffer.from string), (error, result) ->
      if error
        reject error
      else
        resolve result.toString encoding

isCompressible = (buffer, accept) ->
  return false if buffer.length < 1000
  return true if (/^application\/json$/.test accept) ||
    (/^application\/javascript$/.test accept) ||
    (/^text\//.test accept) ||
    (/^image\/svg/.test accept)

  false

export {gzip, ungzip, isCompressible}

import Crypto from "crypto"

# TODO: Make this sensitive to encoding that are not utf-8.
md5 = (obj) ->
  Crypto.createHash('md5').update(JSON.stringify(obj), 'utf-8').digest("hex")

export {md5}

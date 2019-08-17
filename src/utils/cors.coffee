import {keys, toUpper, include} from "panda-parchment"

allowedHeaders = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Cache-Control,ETag,Last-Modified,Accept,Accept-Encoding, Location,Capability"

exposedHeaders = "Content-Type,X-Amz-Date,Authorization,Cache-Control,ETag,Last-Modified,Content-Encoding,Vary,Location,Capability"

matchCORS = (context) ->
  {methods} = context.match.data
  methodList = (toUpper m for m in keys methods).join ","

  include context.response.headers,
    "Access-Control-Allow-Headers": allowedHeaders
    "Access-Control-Allow-Methods": methodList
    "Access-Control-Allow-Origin": "*"
    "Access-Control-Expose-Headers": exposedHeaders

  context

defaultCORS =
  "Access-Control-Allow-Headers": allowedHeaders
  "Access-Control-Allow-Origin": "*"
  "Access-Control-Expose-Headers": exposedHeaders

export {matchCORS, defaultCORS}

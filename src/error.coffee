import {toJSON} from "panda-parchment"
import logger from "./logger"

handler = (callback, {stack, code, tag, headers={}, body=""}) ->
  switch code
    when undefined
      logger.error "Status 500", stack
      callback null,
        statusCode: 500
        statusDescription: "500 internal server error"
    when 304
      logger.debug "Status 304"
      callback null,
        statusCode: 304
        statusDescription: "304 not modified"
        headers: headers
    else
      logger.warn "Status #{code}", stack
      callback null,
        statusCode: code
        statusDescription: "#{code} #{tag}"
        isBase64Encoded: false
        headers:
            "Content-Type": "application/json"
        body: toJSON error: body

export default handler

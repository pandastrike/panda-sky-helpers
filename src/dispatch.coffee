# Provides the dispatching logic so Sky apps don't need to know how we
# structure things.
import {toJSON, merge} from "panda-parchment"
import response from "./responses"
import logger from "./logger"

dispatch = (handlers) ->
  (request, context, callback) ->
    logger.debug "Dispatching to '#{context.functionName}' handler"
    handler = handlers[context.functionName]
    unless typeof handler == 'function'
      logger.error context.functionName + "Is not a function"
      return callback "<internal server error>"

    request.lambdaContext = context
    try
      callback null, (await handler request).response
    catch e
      {stack, code, tag, metadata={}, data={}, message=""} = e
      switch code
        when undefined
          logger.error "Status 500", stack
          callback toJSON
            httpStatus: 500
            data:
              message: "<internal server error>"
        when 304
          logger.debug "Status 304"
          callback toJSON
            httpStatus: 304
            metadata: metadata
            data:
              message: "<#{tag}>"
        else
          logger.warn "Status #{code}", stack
          callback toJSON
            httpStatus: code
            metadata: metadata
            data:
              message: "<#{tag}> #{message}"
              data: data

export default dispatch

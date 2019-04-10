# Provides the dispatching logic so Sky apps don't need to know how we
# structure things.
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
      {stack, code, tag, message=""} = e
      switch code
        when undefined
          logger.error "Status 500", stack
          callback "<internal server error>"
        when 304
          logger.debug "Status 304"
          callback "<not modified>"
        else
          logger.warn "Status #{code}", stack
          callback "<#{tag}> #{message}"

export default dispatch

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
      {stack, tag="internal server error", reason="", message=""} = e
      if tag == "not modified"
        logger.debug "304 reply"
        return callback "<#{tag}>"
      else
        logger.error "Error in #{context.functionName}: ", stack
        msg = "<#{tag}>"
        msg += " #{reason}" if reason != ""
        msg += " #{message}" if message != ""
        return callback msg

export default dispatch

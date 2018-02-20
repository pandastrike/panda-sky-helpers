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

    new Promise (resolve, reject) ->
      resolve handler request, context
    .then (result) -> callback null, result
    .catch ({stack, tag="internal server error", reason="", message=""}) ->
      logger.error "Error in #{context.functionName}: ", stack
      msg = "<#{tag}>"
      msg += " #{reason}" if reason != ""
      msg += " #{message}" if message != ""
      callback msg

export default dispatch

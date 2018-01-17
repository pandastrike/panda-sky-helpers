# Provides the dispatching logic so Sky apps don't need to know how we
# structure things.
import response from "./responses"
import logger from "./logger"

dispatch = (handlers) ->
  (request, context, callback) ->
    logger.debug "Dispatching to '#{context.functionName}' handler"
    handler = handlers[context.functionName]
    unless typeof handler == 'function'
      logger.error "Failed to execute: " + context.functionName
      return callback new response.Internal()

    new Promise (resolve, reject) ->
      resolve handler request, context
    .then (result) -> callback null, result
    .catch (e) ->
      logger.error "Error in #{context.functionName}: ", e.stack
      msg =
        if e.reason
          e.reason
        else if e.message
          e.message
        else
          "There was an error."
      callback msg

export default dispatch

# Provides the dispatching logic so Sky apps don't need to know how we
# structure things.
import response from "./responses"

dispatch = (handlers) ->
  (request, context, callback) ->
    console.info "Dispatching to '#{context.functionName}' handler"
    handler = handlers[context.functionName]
    unless typeof handler == 'function'
      console.error "Failed to execute: " + context.functionName
      return callback new response.Internal()

    Promise.resolve handler request, context
    .then (result) ->
      callback null, result
    .catch (e) ->
      console.error "Error in #{context.functionName}: ", e.stack
      callback e.message || "There was an error."

export default dispatch

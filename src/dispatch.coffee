# Provides the dispatching logic so Sky apps don't need to know how we
# structure things.
import response from "./responses"

dispatch = (handlers) ->
  (request, context, callback) ->
    console.error "Dispatching to '#{context.functionName}' handler"
    handler = handlers[context.functionName]
    unless typeof handler == 'function'
      console.error "Failed to execute: " + context.functionName
      return callback new response.Internal()

    try
      callback null, (await handler request, context)
    catch e
      callback e

export default dispatch

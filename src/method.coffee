import {toLower, toJSON, dashed, sleep} from "panda-parchment"
import Responses from "./responses"
{NotImplemented} = Responses

methodDispatcher = (resources) ->

  (context, lambdaContext, callback) ->
    if context.cuddleMonkey?
      time = 3000
      logger.debug "Cuddle Monkey Preheater Invocation: #{time}ms"
      await sleep time
      return callback null, "Cuddle Monkey success"

    {match:{data:{resource}, method}} = context
    console.log resource, method
    unless f = resources[dashed resource]?[toLower method]
      context.handlerError = Responses.bundle new NotImplemented "no handler for #{method} #{resource}"
      return callback null, context

    try
      callback null, await f context
    catch error
      console.log error
      context.handlerError = Responses.bundle error
      callback null, context

export default methodDispatcher

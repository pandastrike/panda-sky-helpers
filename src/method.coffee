import {toLower, toJSON, dashed} from "panda-parchment"
import Responses from "./responses"
{NotImplemented} = Responses

methodDispatcher = (resources) ->

  (context, lambdaContext, callback) ->
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

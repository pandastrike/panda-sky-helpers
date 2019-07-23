import {toLower, toJSON} from "panda-parchment"
import Responses from "./responses"
{NotImplemented} = Responses

methodDispatcher = (resources) ->

  (context, lambdaContext, callback) ->
    {match:{data:{resource}, method}} = context

    unless f = resources[resource]?[toLower method]
      return callback new NotImplemented "no handler for #{method} #{resource}"

    try
      callback null, await f context
    catch error
      console.log error
      callback error

export default methodDispatcher

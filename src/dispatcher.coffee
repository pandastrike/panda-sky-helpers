import {flow, wrap} from "panda-garden"
import {include} from "panda-parchment"

import {classify} from "./classify"
import {dispatch} from "./dispatch"
import {response} from "./respond"
import {handleError} from "./error"

setup = (api, request, context, callback) ->
  context.callbackWaitsForEmptyEventLoop = false

  {definition, router} = await api
  include {definition, router}, {request, context, callback}

dispatcher = (definition) ->
  (request, context, callback) ->
    try
      do await flow [
        wrap setup definition, request, context, callback
        classify
        dispatch
        respond
      ]
    catch error
      handleError callback, error

export default dispatcher

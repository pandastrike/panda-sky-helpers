import {metrics, authorization, accept, cache, execute, schema} from "./request"
import {stamp, location, capability} from "./response"
import log from "../logger"
import {oneShot} from "../utils"

method = (signatures, handler) ->

  (request) ->
    if request.source == "cuddle-monkey"
      log.debug "Cuddle Monkey preheater invocation."
      return true

    oneShot [
      request
      metrics
      schema signatures
      accept signatures
      authorization
      cache
      execute handler
      stamp signatures
      location
      capability
    ]

export default method

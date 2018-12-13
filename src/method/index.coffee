import {authorization, accept, cache, execute, schema} from "./request"
import {stamp} from "./response"
import log from "../logger"
import {oneShot} from "../utils"

method = (signatures, handler) ->

  (request) ->
    if request.source == "cuddle-monkey"
      log.debug "Cuddle Monkey preheater invocation."
      return true

    oneShot [
      request
      schema signatures
      accept signatures
      authorization
      cache
      execute handler
      stamp signatures
    ]

export default method

import {go, map, wait} from "panda-river"
import {authorization, accept, cache} from "./headers"
import {stamp} from "./response"
import log from "../logger"

execute = (lambda, request) ->
  data: await handler request, lambda
  cache: request.cache
  metadata:
    headers:
      "Content-Type": request.accept

method = (signatures, handler) ->

  (request, lambda) ->
    if request.source == "cuddle-monkey"
      log.debug "Cuddle Monkey preheater invocation."
      return true

    go [
      request
      map authorization
      map accept signatures
      map cache
      wait map execute lambda
      map stamp signatures
    ]

export default method

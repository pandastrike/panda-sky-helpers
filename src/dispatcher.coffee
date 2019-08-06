import {flow, wrap} from "panda-garden"
import {toJSON, merge, sleep, microseconds} from "panda-parchment"

import log from "./logger"
import meter from "./meter"
import classify from "./classify"
import dispatch from "./dispatch"
import {defaultCORS} from "./cors"

setup = (start, request, router, handlers) ->
  response = headers: {}
  {start, request, router, handlers, response}

go = flow [setup, classify, dispatch]

dispatcher = (bundle) ->

  (request, context, callback) ->
    start = microseconds()
    if request.cuddleMonkey?
      time = 3000
      log.debug "Cuddle Monkey Preheater Invocation: #{time}ms"
      await sleep time
      await bundle
      return callback null, "Cuddle Monkey success"

    [router, handlers] = await bundle

    try
      callback null, await go start, request, router, handlers
    catch error
      {stack, code, tag, body="", headers={}} = error
      if code == undefined
        log.error "Status 500", stack
        callback null,
          statusCode: 500
          statusDescription: "500 Internal Server Error"
          headers: defaultCORS
          isBase64Encoded: false
      else
        log.warn "Status #{code}", stack
        callback null,
          statusCode: code
          statusDescription: tag
          headers: merge defaultCORS, headers,
            "Content-Type": "application/json"
          body: toJSON error: body
          isBase64Encoded: false

export default dispatcher

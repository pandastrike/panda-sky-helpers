import {flow, wrap} from "panda-garden"
import {toJSON, merge, sleep, microseconds} from "panda-parchment"

import meter from "./meter"
import classify from "./classify"
import dispatch from "./dispatch"
import {defaultCORS} from "./cors"

setup = (start, request, router, handlers) ->
  response = headers: {}
  {start, request, router, handlers, response}

go = flow [setup, classify, dispatch]

dispatcher = (bundle, time=3000) ->

  (request, context, callback) ->
    try
      start = microseconds()
      if request.cuddleMonkey?
        console.debug "Cuddle Monkey Preheater Invocation: #{time}ms"
        await sleep time
        await bundle
        return callback null, "Cuddle Monkey success"

      [router, handlers] = await bundle

      # Wait until dependencies are loaded before registering source maps
      require "source-map-support/register"

      callback null, await go start, request, router, handlers
    catch error
      {stack, code, tag, body="", headers={}} = error
      if code == undefined
        console.error "Status 500", stack
        callback null,
          statusCode: 500
          statusDescription: "500 Internal Server Error"
          headers: defaultCORS
          isBase64Encoded: false
      else
        console.warn "Status #{code}", stack
        callback null,
          statusCode: code
          statusDescription: tag
          headers: merge defaultCORS, headers,
            "Content-Type": "application/json"
          body: toJSON error: body
          isBase64Encoded: false

export default dispatcher

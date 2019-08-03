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

dispatcher = (bundle) ->

  (request, context, callback) ->
    start = microseconds()
    if request.cuddleMonkey?
      time = 3000
      log.debug "Cuddle Monkey Preheater Invocation: #{time}ms"
      await sleep time
      [router, handlers] = await bundle
      return callback null, "Cuddle Monkey success"

    [router, handlers] = await bundle

    new Promise (resolve, reject) ->
      (flow [setup, classify, dispatch]) start, request, router, handlers
      .then (response) ->
        resolve callback null, response
      .catch (error) ->
        {stack, code, tag, body="", headers={}} = error
        console.log {code, tag, body, headers}
        switch code
          when undefined
            log.error "Status 500", stack
            resolve callback null,
              statusCode: 500
              statusDescription: "500 Internal Server Error"
              headers: defaultCORS
              isBase64Encoded: false
          when 304
            log.debug "Status 304"
            resolve callback null,
              statusCode: code
              statusDescription: tag
              headers: merge defaultCORS, headers
              isBase64Encoded: false
          else
            log.warn "Status #{code}", stack
            resolve callback null,
              statusCode: code
              statusDescription: tag
              headers: merge defaultCORS, headers,
                "Content-Type": "application/json"
              body: toJSON error: body
              isBase64Encoded: false

    .catch (error) ->
      log.error "failsafe handler", stack
      callback null,
        statusCode: 500
        statusDescription: "500 Internal Server Error"
        headers: defaultCORS
        isBase64Encoded: false

export default dispatcher

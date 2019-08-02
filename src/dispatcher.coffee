import {flow, wrap} from "panda-garden"
import {toJSON, merge, sleep} from "panda-parchment"

import log from "./logger"
import meter from "./meter"
import classify from "./classify"
import dispatch from "./dispatch"
import {defaultCORS} from "./cors"

setup = (request, router, handlers) ->
  response = headers: {}
  {request, router, handlers, response}

dispatcher = (bundle) ->

  (request, context, callback) ->
    [router, handlers] = await bundle

    if request.cuddleMonkey?
      time = 3000
      log.debug "Cuddle Monkey Preheater Invocation: #{time}ms"
      await sleep time
      return callback null, "Cuddle Monkey success"

    new Promise (resolve, reject) ->
      (meter "Dispatch", flow [setup, classify, dispatch]) request, router, handlers
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

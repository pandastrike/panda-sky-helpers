import {flow} from "panda-garden"
import {toJSON, merge, sleep, microseconds} from "panda-parchment"

import meter from "../utils/meter"
import {defaultCORS} from "../utils/cors"

dispatcher = (go) ->
  (bundle) -> (request, context, callback) ->
    start = microseconds()
    if request.cuddleMonkey?
      time = 3000
      console.debug "Cuddle Monkey Preheater Invocation: #{time}ms"
      await sleep time
      await bundle
      return callback null, "Cuddle Monkey success"

    [router, handlers] = await bundle

    try
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

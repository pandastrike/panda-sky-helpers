import {flow, wrap} from "panda-garden"
import {toJSON, merge} from "panda-parchment"

import classify from "./classify"
import dispatch from "./dispatch"
import response from "./respond"
import {defaultCORS} from "./cors"

setup = (api, request, lambdaContext, callback) ->
  lambdaContext.callbackWaitsForEmptyEventLoop = false

  response = {}
  {definition, router} = await api
  {definition, router, request, response, lambdaContext, callback}

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
      {stack, code, tag, body="", headers={}} = error
      switch code
        when undefined
          logger.error "Status 500", stack
          callback null,
            statusCode: 500
            statusDescription: "500 Internal Server Error"
            headers: defaultCORS
        when 304
          logger.debug "Status 304"
          callback null,
            statusCode: code
            statusDescription: tag
            headers: merge defaultCORS, headers
        else
          logger.warn "Status #{code}", stack
          callback null,
            statusCode: code
            statusDescription: tag
            headers: merge defaultCORS,
              "Content-Type": "application/json"
            body: toJSON error: body

export default dispatcher

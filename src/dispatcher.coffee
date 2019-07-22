import {flow, wrap} from "panda-garden"
import {toJSON, merge} from "panda-parchment"

import logger from "./logger"
import classify from "./classify"
import dispatch from "./dispatch"
import {defaultCORS} from "./cors"

setup = (api, request, lambdaContext, callback) ->
  response = {}
  {definition, router} = await api
  {definition, router, request, response, lambdaContext, callback}

dispatcher = (definition) ->
  (request, context, callback) ->
    new Promise (resolve, reject) ->
      (do flow [
        wrap setup definition, request, context, callback
        classify
        dispatch
      ])
      .then (response) -> resolve response
      .catch (error) ->
        {stack, code, tag, body="", headers={}} = error
        switch code
          when undefined
            logger.error "Status 500", stack
            resolve callback null,
              statusCode: 500
              statusDescription: "500 Internal Server Error"
              headers: defaultCORS
              isBase64Encoded: false
          when 304
            logger.debug "Status 304"
            resolve callback null,
              statusCode: code
              statusDescription: tag
              headers: merge defaultCORS, headers
              isBase64Encoded: false
          else
            logger.warn "Status #{code}", stack
            resolve callback null,
              statusCode: code
              statusDescription: tag
              headers: merge defaultCORS,
                "Content-Type": "application/json"
              body: toJSON error: body
              isBase64Encoded: false

export default dispatcher

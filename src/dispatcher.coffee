import {flow, wrap} from "panda-garden"
import {fromJSON, toJSON, merge} from "panda-parchment"
import {read} from "panda-quill"
import {Router} from "panda-router"

import logger from "./logger"
import classify from "./classify"
import dispatch from "./dispatch"
import {defaultCORS} from "./cors"

buildRouter = (definition) ->
  router = new Router()
  for r, {template, methods} of definition.resources
    router.add
      template: template
      data:
        resource: r
        template: template
        methods: methods

  router

setup = (path, request) ->
  response = headers: {}
  definition = fromJSON await read path
  router = buildRouter definition
  {definition, router, request, response}


dispatcher = (path) ->
  (request, context, callback) ->
    new Promise (resolve, reject) ->
      (flow [setup, classify, dispatch]) path, request
      .then (response) ->
        resolve callback null, response
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

    .catch (error) ->
      logger.error "failsafe handler", stack
      callback null,
        statusCode: 500
        statusDescription: "500 Internal Server Error"
        headers: defaultCORS
        isBase64Encoded: false

export default dispatcher

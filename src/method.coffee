import {parse} from "panda-auth-header"
import log from "./logger"

method = (handler) ->
  # TODO: parse Accept header
  # TODO: logging instrumentation
  # TODO: Allow the reaction to CloudWatch events to default to short-circuiting with an optional override based on extracting a special handler from each API file.

  (request, context) ->
    if request.source == "cuddle-monkey"
      log.info "Detected a Cuddle Monkey preheater invocation. Short circuting request cycle."
      return true

    if (header = request.headers?['Authorization'])?
      {scheme, params, token} = parse header
      if token
        request.authorization = {scheme, token}
      else
        request.authorization = {scheme, params}
    handler request, context

export default method

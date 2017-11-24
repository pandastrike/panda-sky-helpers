import {parse} from "auth-header"

method = (handler) ->
  # TODO: parse Accept header
  # TODO: logging instrumentation
  (request, context) ->
    if (header = request.headers['Authorization'])?
      {scheme, params, token} = parse header
      if token
        request.authorization = {scheme, token}
      else
        request.authorization = {scheme, params}
    handler request, context

export default method

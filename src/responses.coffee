# Special class to describe the HTTP response that should be sent back.  Gateway
# searches the message string of a JS Error Class, so we're bundling all
# statuses in an error package, givng end users the ability to select a response
# overriding the default for a Lambda / Gateway handler.

# The error tag is a target that's easy to hit with Gateway's regex hook on error reponses.  That allows it to dispatch the correct status code.

import StandardError from "standard-error"
import {toJSON, fromJSON} from "panda-parchment"

create = (name, tag, code) ->
  errorConstructor = (body, headers) ->
    StandardError.call(this, name, {tag, code, body, headers})

  errorConstructor.prototype = Object.create StandardError.prototype,
    {constructor: {value: errorConstructor, configurable: true, writable: true}}

  errorConstructor.prototype.name = name
  return errorConstructor

responses =
  hydrate: (str) ->
    {name, tag, code, body, headers} = fromJSON str
    new StandardError name, {tag, code, body, headers}

  bundle: ({name, tag, code, body, headers}) ->
    toJSON {name, tag, code, body, headers}

  Continue: create "Continue", "100 Continue", 100

  OK: create "OK", "200 OK", 200
  Created: create "Created", "201 Created", 201
  Accepted: create "Accepted", "202 Accepted", 202
  NonAuthoritativeInformation: create "NonAuthoritativeInformation", "203 Non-Authoritative Information", 203
  NoContent: create "NoContent", "204 No Content", 204
  ResetContent: create "ResetContent", "205 Reset Content", 205
  PartialContent: create "PartialContent", "206 Partial Content", 206

  MultipleChoices: create "MultipleChoices", "300 Multiple Choices", 300
  MovedPermanently: create "MovedPermanently", "301 Moved Permanently", 301
  Found: create "Found", "302 Found", 302
  SeeOther: create "SeeOther", "303 See Other", 303
  NotModified: create "NotModified", "304 Not Modified", 304
  UseProxy: create "UseProxy", "305 Use Proxy", 305
  TemporaryRedirect: create "TemporaryRedirect", "307 Temporary Redirect", 307

  BadRequest: create "BadRequest", "400 Bad Request", 400
  Unauthorized: create "Unauthorized", "401 Unauthorized", 401
  PaymentRequired: create "PaymentRequired", "402 Payment Required", 402
  Forbidden: create "Forbidden", "403 Forbidden", 403
  NotFound: create "NotFound", "404 Not Found", 404
  MethodNotAllowed: create "MethodNotAllowed", "405 Method Not Allowed", 405
  NotAcceptable: create "NotAcceptable", "406 Not Acceptable", 406
  ProxyAuthenticationRequired: create "ProxyAuthenticationRequired", "407 Proxy Authentication Required", 407
  RequestTimeout: create "RequestTimeout", "408 Request Timeout", 408
  Conflict: create "Conflict", "409 Conflict", 409
  Gone: create "Gone", "401 Gone", 410
  LengthRequired: create "LengthRequired", "411 Length Required", 411
  PreconditionFailed: create "PreconditionFailed", "412 Precondition Failed", 412
  PayloadTooLarge: create "TooLarge", "413 Payload Too Large", 413
  URITooLong: create "URITooLong", "414 URI Too Long", 414
  UnsupportedMediaType: create "UnsupportedMediaType", "415 Unsupported Media Type", 415
  RangeNotSatisfiable: create "RangeNotSatisfiable", "416 Range Not Satisfiable", 416
  ExpectationFailed: create "ExpectationFailed", "417 Expectation Failed", 417
  UpgradeRequired: create "UpgradeRequired", "426 Upgrade Required", 426

  Internal: create "Internal", "500 Internal Server Error", 500
  NotImplemented: create "NotImplemented", "501 Not Implemented", 501
  BadGateway: create "BadGateway", "502 Bad Gateway", 502
  ServiceUnavailable: create "ServiceUnavailable", "503 Service Unavailable", 503
  GatewayTimeout: create "GatewayTimeout", "504 Gateway Timeout", 504
  HTTPVersionNotSupported: create "HTTPVersionNotSupported", "505 HTTP Version Not Supported", 505


  100: "100 Continue"

  200: "200 OK"
  201: "201 Created"
  202: "202 Accepted"
  203: "203 Non-Authoritative Information"
  204: "204 No Content"
  205: "205 Reset Content"
  206: "206 Partial Content"

  300: "300 Multiple Choices"
  301: "301 Moved Permanently"
  302: "302 Found"
  303: "303 See Other"
  304: "304 Not Modified"
  305: "305 Use Proxy"
  307: "307 Temporary Redirect"

  400: "400 Bad Request"
  401: "401 Unauthorized"
  402: "402 Payment Required"
  403: "403 Forbidden"
  404: "404 Not Found"
  405: "405 Method Not Allowed"
  406: "406 Not Acceptable"
  407: "407 Proxy Authentication Required"
  408: "408 Request Timeout"
  409: "409 Conflict"
  410: "401 Gone"
  411: "411 Length Required"
  412: "412 Precondition Failed"
  413: "413 Payload Too Large"
  414: "414 URI Too Long"
  415: "415 Unsupported Media Type"
  416: "416 Range Not Satisfiable"
  417: "417 Expectation Failed"
  426: "426 Upgrade Required"

  500: "500 Internal Server Error"
  501: "501 Not Implemented"
  502: "502 Bad Gateway"
  503: "503 Service Unavailable"
  504: "504 Gateway Timeout"
  505: "505 HTTP Version Not Supported"

export default responses

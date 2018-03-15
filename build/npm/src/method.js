"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pandaAuthHeader = require("panda-auth-header");

var method;

method = function (handler) {
  // TODO: parse Accept header
  // TODO: logging instrumentation
  return function (request, context) {
    var header, params, ref, scheme, token;
    if ((header = (ref = request.headers) != null ? ref['Authorization'] : void 0) != null) {
      ({ scheme, params, token } = (0, _pandaAuthHeader.parse)(header));
      if (token) {
        request.authorization = { scheme, token };
      } else {
        request.authorization = { scheme, params };
      }
    }
    return handler(request, context);
  };
};

exports.default = method;
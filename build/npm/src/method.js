"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pandaAuthHeader = require("panda-auth-header");

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var method;

method = function (handler) {
  // TODO: parse Accept header
  // TODO: logging instrumentation
  // TODO: Allow the reaction to CloudWatch events to default to short-circuiting with an optional override based on extracting a special handler from each API file.
  return function (request, context) {
    var header, params, ref, scheme, token;
    if (request.source === "cuddle-monkey") {
      _logger2.default.info("Detected a Cuddle Monkey preheater invocation. Short circuting request cycle.");
      return true;
    }
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
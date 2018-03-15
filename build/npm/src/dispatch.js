"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _responses = require("./responses");

var _responses2 = _interopRequireDefault(_responses);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Provides the dispatching logic so Sky apps don't need to know how we
// structure things.
var dispatch;

dispatch = function (handlers) {
  return function (request, context, callback) {
    var handler;
    _logger2.default.debug(`Dispatching to '${context.functionName}' handler`);
    handler = handlers[context.functionName];
    if (typeof handler !== 'function') {
      _logger2.default.error(context.functionName + "Is not a function");
      return callback("<internal server error>");
    }
    return new Promise(function (resolve, reject) {
      return resolve(handler(request, context));
    }).then(function (result) {
      return callback(null, result);
    }).catch(function ({ stack, tag = "internal server error", reason = "", message = "" }) {
      var msg;
      _logger2.default.error(`Error in ${context.functionName}: `, stack);
      msg = `<${tag}>`;
      if (reason !== "") {
        msg += ` ${reason}`;
      }
      if (message !== "") {
        msg += ` ${message}`;
      }
      return callback(msg);
    });
  };
};

exports.default = dispatch;
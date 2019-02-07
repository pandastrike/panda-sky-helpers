"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _responses = _interopRequireDefault(require("./responses"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Provides the dispatching logic so Sky apps don't need to know how we
// structure things.
var dispatch;

dispatch = function (handlers) {
  return async function (request, context, callback) {
    var e, handler, message, msg, reason, stack, tag;

    _logger.default.debug(`Dispatching to '${context.functionName}' handler`);

    handler = handlers[context.functionName];

    if (typeof handler !== 'function') {
      _logger.default.error(context.functionName + "Is not a function");

      return callback("<internal server error>");
    }

    request.lambdaContext = context;

    try {
      return callback(null, (await handler(request)).response);
    } catch (error) {
      e = error;
      ({
        stack,
        tag = "internal server error",
        reason = "",
        message = ""
      } = e);

      if (tag === "not modified") {
        _logger.default.debug("304 reply");

        return callback(`<${tag}>`);
      } else {
        _logger.default.error(`Error in ${context.functionName}: `, stack);

        msg = `<${tag}>`;

        if (reason !== "") {
          msg += ` ${reason}`;
        }

        if (message !== "") {
          msg += ` ${message}`;
        }

        return callback(msg);
      }
    }
  };
};

var _default = dispatch;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7OztBQUhBOztBQUFBLElBQUEsUUFBQTs7QUFLQSxRQUFBLEdBQVcsVUFBQSxRQUFBLEVBQUE7U0FDVCxnQkFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQTtBQUNFLFFBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsR0FBQTs7QUFBQSxvQkFBQSxLQUFBLENBQWEsbUJBQW1CLE9BQU8sQ0FBMUIsWUFBYixXQUFBOztBQUNBLElBQUEsT0FBQSxHQUFVLFFBQVMsQ0FBQSxPQUFPLENBQVAsWUFBQSxDQUFuQjs7QUFDQSxRQUFPLE9BQUEsT0FBQSxLQUFQLFVBQUEsRUFBQTtBQUNFLHNCQUFBLEtBQUEsQ0FBYSxPQUFPLENBQVAsWUFBQSxHQUFiLG1CQUFBOztBQUNBLGFBQU8sUUFBQSxDQUZULHlCQUVTLENBQVA7OztBQUVGLElBQUEsT0FBTyxDQUFQLGFBQUEsR0FBd0IsT0FBeEI7O0FBQ0EsUUFBQTthQUNFLFFBQUEsQ0FBQSxJQUFBLEVBQWUsQ0FBQyxNQUFNLE9BQUEsQ0FBUCxPQUFPLENBQVAsRUFEakIsUUFDRSxDO0FBREYsS0FBQSxDQUFBLE9BQUEsS0FBQSxFQUFBO0FBRU0sTUFBQSxDQUFBLEdBQUEsS0FBQTtBQUNKLE9BQUE7QUFBQSxRQUFBLEtBQUE7QUFBUSxRQUFBLEdBQUEsR0FBUix1QkFBQTtBQUFxQyxRQUFBLE1BQUEsR0FBckMsRUFBQTtBQUFnRCxRQUFBLE9BQUEsR0FBaEQ7QUFBQSxVQUFBLENBQUE7O0FBQ0EsVUFBRyxHQUFBLEtBQUgsY0FBQSxFQUFBO0FBQ0Usd0JBQUEsS0FBQSxDQUFBLFdBQUE7O0FBQ0EsZUFBTyxRQUFBLENBQVMsSUFBQSxHQUZsQixHQUVTLENBQVA7QUFGRixPQUFBLE1BQUE7QUFJRSx3QkFBQSxLQUFBLENBQWEsWUFBWSxPQUFPLENBQW5CLFlBQWIsSUFBQSxFQUFBLEtBQUE7O0FBQ0EsUUFBQSxHQUFBLEdBQU0sSUFBQSxHQUFBLEdBQU47O0FBQ0EsWUFBdUIsTUFBQSxLQUF2QixFQUFBLEVBQUE7QUFBQSxVQUFBLEdBQUEsSUFBTyxJQUFBLE1BQVAsRUFBQTs7O0FBQ0EsWUFBd0IsT0FBQSxLQUF4QixFQUFBLEVBQUE7QUFBQSxVQUFBLEdBQUEsSUFBTyxJQUFBLE9BQVAsRUFBQTs7O0FBQ0EsZUFBTyxRQUFBLENBUlQsR0FRUyxDQUFQO0FBWko7O0FBUkYsRztBQURTLENBQVg7O2VBdUJlLFEiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByb3ZpZGVzIHRoZSBkaXNwYXRjaGluZyBsb2dpYyBzbyBTa3kgYXBwcyBkb24ndCBuZWVkIHRvIGtub3cgaG93IHdlXG4jIHN0cnVjdHVyZSB0aGluZ3MuXG5pbXBvcnQgcmVzcG9uc2UgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcblxuZGlzcGF0Y2ggPSAoaGFuZGxlcnMpIC0+XG4gIChyZXF1ZXN0LCBjb250ZXh0LCBjYWxsYmFjaykgLT5cbiAgICBsb2dnZXIuZGVidWcgXCJEaXNwYXRjaGluZyB0byAnI3tjb250ZXh0LmZ1bmN0aW9uTmFtZX0nIGhhbmRsZXJcIlxuICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tjb250ZXh0LmZ1bmN0aW9uTmFtZV1cbiAgICB1bmxlc3MgdHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgbG9nZ2VyLmVycm9yIGNvbnRleHQuZnVuY3Rpb25OYW1lICsgXCJJcyBub3QgYSBmdW5jdGlvblwiXG4gICAgICByZXR1cm4gY2FsbGJhY2sgXCI8aW50ZXJuYWwgc2VydmVyIGVycm9yPlwiXG5cbiAgICByZXF1ZXN0LmxhbWJkYUNvbnRleHQgPSBjb250ZXh0XG4gICAgdHJ5XG4gICAgICBjYWxsYmFjayBudWxsLCAoYXdhaXQgaGFuZGxlciByZXF1ZXN0KS5yZXNwb25zZVxuICAgIGNhdGNoIGVcbiAgICAgIHtzdGFjaywgdGFnPVwiaW50ZXJuYWwgc2VydmVyIGVycm9yXCIsIHJlYXNvbj1cIlwiLCBtZXNzYWdlPVwiXCJ9ID0gZVxuICAgICAgaWYgdGFnID09IFwibm90IG1vZGlmaWVkXCJcbiAgICAgICAgbG9nZ2VyLmRlYnVnIFwiMzA0IHJlcGx5XCJcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrIFwiPCN7dGFnfT5cIlxuICAgICAgZWxzZVxuICAgICAgICBsb2dnZXIuZXJyb3IgXCJFcnJvciBpbiAje2NvbnRleHQuZnVuY3Rpb25OYW1lfTogXCIsIHN0YWNrXG4gICAgICAgIG1zZyA9IFwiPCN7dGFnfT5cIlxuICAgICAgICBtc2cgKz0gXCIgI3tyZWFzb259XCIgaWYgcmVhc29uICE9IFwiXCJcbiAgICAgICAgbXNnICs9IFwiICN7bWVzc2FnZX1cIiBpZiBtZXNzYWdlICE9IFwiXCJcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrIG1zZ1xuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
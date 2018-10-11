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

    try {
      return callback(null, (await handler(request, context)));
    } catch (error) {
      e = error;
      ({
        stack,
        tag = "internal server error",
        reason = "",
        message = ""
      } = e);

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
  };
};

var _default = dispatch;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BhdGNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFIQTs7QUFBQSxJQUFBLFFBQUE7O0FBS0EsUUFBQSxHQUFXLFVBQUEsUUFBQSxFQUFBO1NBQ1QsZ0JBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7QUFDRSxRQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUE7O0FBQUEsb0JBQUEsS0FBQSxDQUFhLG1CQUFtQixPQUFPLENBQTFCLFlBQWIsV0FBQTs7QUFDQSxJQUFBLE9BQUEsR0FBVSxRQUFTLENBQUEsT0FBTyxDQUFQLFlBQUEsQ0FBbkI7O0FBQ0EsUUFBTyxPQUFBLE9BQUEsS0FBUCxVQUFBLEVBQUE7QUFDRSxzQkFBQSxLQUFBLENBQWEsT0FBTyxDQUFQLFlBQUEsR0FBYixtQkFBQTs7QUFDQSxhQUFPLFFBQUEsQ0FGVCx5QkFFUyxDQUFQOzs7QUFFRixRQUFBO2FBQ0UsUUFBQSxDQUFBLElBQUEsR0FBZ0IsTUFBTSxPQUFBLENBQUEsT0FBQSxFQUR4QixPQUN3QixDQUF0QixFO0FBREYsS0FBQSxDQUFBLE9BQUEsS0FBQSxFQUFBO0FBRU0sTUFBQSxDQUFBLEdBQUEsS0FBQTtBQUNKLE9BQUE7QUFBQSxRQUFBLEtBQUE7QUFBUSxRQUFBLEdBQUEsR0FBUix1QkFBQTtBQUFxQyxRQUFBLE1BQUEsR0FBckMsRUFBQTtBQUFnRCxRQUFBLE9BQUEsR0FBaEQ7QUFBQSxVQUFBLENBQUE7O0FBQ0Esc0JBQUEsS0FBQSxDQUFhLFlBQVksT0FBTyxDQUFuQixZQUFiLElBQUEsRUFBQSxLQUFBOztBQUNBLE1BQUEsR0FBQSxHQUFNLElBQUEsR0FBQSxHQUFOOztBQUNBLFVBQXVCLE1BQUEsS0FBdkIsRUFBQSxFQUFBO0FBQUEsUUFBQSxHQUFBLElBQU8sSUFBQSxNQUFQLEVBQUE7OztBQUNBLFVBQXdCLE9BQUEsS0FBeEIsRUFBQSxFQUFBO0FBQUEsUUFBQSxHQUFBLElBQU8sSUFBQSxPQUFQLEVBQUE7OzthQUNBLFFBQUEsQ0FSRixHQVFFLEM7O0FBZkosRztBQURTLENBQVg7O2VBa0JlLFEiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByb3ZpZGVzIHRoZSBkaXNwYXRjaGluZyBsb2dpYyBzbyBTa3kgYXBwcyBkb24ndCBuZWVkIHRvIGtub3cgaG93IHdlXG4jIHN0cnVjdHVyZSB0aGluZ3MuXG5pbXBvcnQgcmVzcG9uc2UgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcblxuZGlzcGF0Y2ggPSAoaGFuZGxlcnMpIC0+XG4gIChyZXF1ZXN0LCBjb250ZXh0LCBjYWxsYmFjaykgLT5cbiAgICBsb2dnZXIuZGVidWcgXCJEaXNwYXRjaGluZyB0byAnI3tjb250ZXh0LmZ1bmN0aW9uTmFtZX0nIGhhbmRsZXJcIlxuICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tjb250ZXh0LmZ1bmN0aW9uTmFtZV1cbiAgICB1bmxlc3MgdHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgbG9nZ2VyLmVycm9yIGNvbnRleHQuZnVuY3Rpb25OYW1lICsgXCJJcyBub3QgYSBmdW5jdGlvblwiXG4gICAgICByZXR1cm4gY2FsbGJhY2sgXCI8aW50ZXJuYWwgc2VydmVyIGVycm9yPlwiXG5cbiAgICB0cnlcbiAgICAgIGNhbGxiYWNrIG51bGwsIChhd2FpdCBoYW5kbGVyIHJlcXVlc3QsIGNvbnRleHQpXG4gICAgY2F0Y2ggZVxuICAgICAge3N0YWNrLCB0YWc9XCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgcmVhc29uPVwiXCIsIG1lc3NhZ2U9XCJcIn0gPSBlXG4gICAgICBsb2dnZXIuZXJyb3IgXCJFcnJvciBpbiAje2NvbnRleHQuZnVuY3Rpb25OYW1lfTogXCIsIHN0YWNrXG4gICAgICBtc2cgPSBcIjwje3RhZ30+XCJcbiAgICAgIG1zZyArPSBcIiAje3JlYXNvbn1cIiBpZiByZWFzb24gIT0gXCJcIlxuICAgICAgbXNnICs9IFwiICN7bWVzc2FnZX1cIiBpZiBtZXNzYWdlICE9IFwiXCJcbiAgICAgIGNhbGxiYWNrIG1zZ1xuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=dispatch.coffee
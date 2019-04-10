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
    var code, e, handler, message, stack, tag;

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
        code,
        tag,
        message = ""
      } = e);

      switch (code) {
        case void 0:
          _logger.default.error("Status 500", stack);

          return callback("<internal server error>");

        case 304:
          _logger.default.debug("Status 304");

          return callback("<not modified>");

        default:
          _logger.default.warn(`Status ${code}`, stack);

          return callback(`<${tag}> ${message}`);
      }
    }
  };
};

var _default = dispatch;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7OztBQUhBOztBQUFBLElBQUEsUUFBQTs7QUFLQSxRQUFBLEdBQVcsVUFBQSxRQUFBLEVBQUE7U0FDVCxnQkFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxHQUFBOztBQUFBLG9CQUFBLEtBQUEsQ0FBYSxtQkFBbUIsT0FBTyxDQUExQixZQUFiLFdBQUE7O0FBQ0EsSUFBQSxPQUFBLEdBQVUsUUFBUyxDQUFBLE9BQU8sQ0FBUCxZQUFBLENBQW5COztBQUNBLFFBQU8sT0FBQSxPQUFBLEtBQVAsVUFBQSxFQUFBO0FBQ0Usc0JBQUEsS0FBQSxDQUFhLE9BQU8sQ0FBUCxZQUFBLEdBQWIsbUJBQUE7O0FBQ0EsYUFBTyxRQUFBLENBRlQseUJBRVMsQ0FBUDs7O0FBRUYsSUFBQSxPQUFPLENBQVAsYUFBQSxHQUF3QixPQUF4Qjs7QUFDQSxRQUFBO2FBQ0UsUUFBQSxDQUFBLElBQUEsRUFBZSxDQUFDLE1BQU0sT0FBQSxDQUFQLE9BQU8sQ0FBUCxFQURqQixRQUNFLEM7QUFERixLQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFFTSxNQUFBLENBQUEsR0FBQSxLQUFBO0FBQ0osT0FBQTtBQUFBLFFBQUEsS0FBQTtBQUFBLFFBQUEsSUFBQTtBQUFBLFFBQUEsR0FBQTtBQUFtQixRQUFBLE9BQUEsR0FBbkI7QUFBQSxVQUFBLENBQUE7O0FBQ0EsY0FBQSxJQUFBO0FBQUEsYUFDTyxLQURQLENBQUE7QUFFSSwwQkFBQSxLQUFBLENBQUEsWUFBQSxFQUFBLEtBQUE7O2lCQUNBLFFBQUEsQ0FBQSx5QkFBQSxDOztBQUhKLGFBQUEsR0FBQTtBQUtJLDBCQUFBLEtBQUEsQ0FBQSxZQUFBOztpQkFDQSxRQUFBLENBQUEsZ0JBQUEsQzs7QUFOSjtBQVFJLDBCQUFBLElBQUEsQ0FBWSxVQUFBLElBQVosRUFBQSxFQUFBLEtBQUE7O2lCQUNBLFFBQUEsQ0FBUyxJQUFBLEdBQUEsS0FBQSxPQUFULEVBQUEsQztBQVRKOztBQVpKLEc7QUFEUyxDQUFYOztlQXdCZSxRIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcm92aWRlcyB0aGUgZGlzcGF0Y2hpbmcgbG9naWMgc28gU2t5IGFwcHMgZG9uJ3QgbmVlZCB0byBrbm93IGhvdyB3ZVxuIyBzdHJ1Y3R1cmUgdGhpbmdzLlxuaW1wb3J0IHJlc3BvbnNlIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5cbmRpc3BhdGNoID0gKGhhbmRsZXJzKSAtPlxuICAocmVxdWVzdCwgY29udGV4dCwgY2FsbGJhY2spIC0+XG4gICAgbG9nZ2VyLmRlYnVnIFwiRGlzcGF0Y2hpbmcgdG8gJyN7Y29udGV4dC5mdW5jdGlvbk5hbWV9JyBoYW5kbGVyXCJcbiAgICBoYW5kbGVyID0gaGFuZGxlcnNbY29udGV4dC5mdW5jdGlvbk5hbWVdXG4gICAgdW5sZXNzIHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbidcbiAgICAgIGxvZ2dlci5lcnJvciBjb250ZXh0LmZ1bmN0aW9uTmFtZSArIFwiSXMgbm90IGEgZnVuY3Rpb25cIlxuICAgICAgcmV0dXJuIGNhbGxiYWNrIFwiPGludGVybmFsIHNlcnZlciBlcnJvcj5cIlxuXG4gICAgcmVxdWVzdC5sYW1iZGFDb250ZXh0ID0gY29udGV4dFxuICAgIHRyeVxuICAgICAgY2FsbGJhY2sgbnVsbCwgKGF3YWl0IGhhbmRsZXIgcmVxdWVzdCkucmVzcG9uc2VcbiAgICBjYXRjaCBlXG4gICAgICB7c3RhY2ssIGNvZGUsIHRhZywgbWVzc2FnZT1cIlwifSA9IGVcbiAgICAgIHN3aXRjaCBjb2RlXG4gICAgICAgIHdoZW4gdW5kZWZpbmVkXG4gICAgICAgICAgbG9nZ2VyLmVycm9yIFwiU3RhdHVzIDUwMFwiLCBzdGFja1xuICAgICAgICAgIGNhbGxiYWNrIFwiPGludGVybmFsIHNlcnZlciBlcnJvcj5cIlxuICAgICAgICB3aGVuIDMwNFxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZyBcIlN0YXR1cyAzMDRcIlxuICAgICAgICAgIGNhbGxiYWNrIFwiPG5vdCBtb2RpZmllZD5cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgbG9nZ2VyLndhcm4gXCJTdGF0dXMgI3tjb2RlfVwiLCBzdGFja1xuICAgICAgICAgIGNhbGxiYWNrIFwiPCN7dGFnfT4gI3ttZXNzYWdlfVwiXG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BhdGNoXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BhdGNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFIQTs7QUFBQSxJQUFBLFFBQUE7O0FBS0EsUUFBQSxHQUFXLFVBQUEsUUFBQSxFQUFBO1NBQ1QsZ0JBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7QUFDRSxRQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUE7O0FBQUEsb0JBQUEsS0FBQSxDQUFhLG1CQUFtQixPQUFPLENBQTFCLFlBQWIsV0FBQTs7QUFDQSxJQUFBLE9BQUEsR0FBVSxRQUFTLENBQUEsT0FBTyxDQUFQLFlBQUEsQ0FBbkI7O0FBQ0EsUUFBTyxPQUFBLE9BQUEsS0FBUCxVQUFBLEVBQUE7QUFDRSxzQkFBQSxLQUFBLENBQWEsT0FBTyxDQUFQLFlBQUEsR0FBYixtQkFBQTs7QUFDQSxhQUFPLFFBQUEsQ0FGVCx5QkFFUyxDQUFQOzs7QUFFRixJQUFBLE9BQU8sQ0FBUCxhQUFBLEdBQXdCLE9BQXhCOztBQUNBLFFBQUE7YUFDRSxRQUFBLENBQUEsSUFBQSxFQUFlLENBQUMsTUFBTSxPQUFBLENBQVAsT0FBTyxDQUFQLEVBRGpCLFFBQ0UsQztBQURGLEtBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUVNLE1BQUEsQ0FBQSxHQUFBLEtBQUE7QUFDSixPQUFBO0FBQUEsUUFBQSxLQUFBO0FBQVEsUUFBQSxHQUFBLEdBQVIsdUJBQUE7QUFBcUMsUUFBQSxNQUFBLEdBQXJDLEVBQUE7QUFBZ0QsUUFBQSxPQUFBLEdBQWhEO0FBQUEsVUFBQSxDQUFBOztBQUNBLFVBQUcsR0FBQSxLQUFILGNBQUEsRUFBQTtBQUNFLHdCQUFBLEtBQUEsQ0FBQSxXQUFBOztBQUNBLGVBQU8sUUFBQSxDQUFTLElBQUEsR0FGbEIsR0FFUyxDQUFQO0FBRkYsT0FBQSxNQUFBO0FBSUUsd0JBQUEsS0FBQSxDQUFhLFlBQVksT0FBTyxDQUFuQixZQUFiLElBQUEsRUFBQSxLQUFBOztBQUNBLFFBQUEsR0FBQSxHQUFNLElBQUEsR0FBQSxHQUFOOztBQUNBLFlBQXVCLE1BQUEsS0FBdkIsRUFBQSxFQUFBO0FBQUEsVUFBQSxHQUFBLElBQU8sSUFBQSxNQUFQLEVBQUE7OztBQUNBLFlBQXdCLE9BQUEsS0FBeEIsRUFBQSxFQUFBO0FBQUEsVUFBQSxHQUFBLElBQU8sSUFBQSxPQUFQLEVBQUE7OztBQUNBLGVBQU8sUUFBQSxDQVJULEdBUVMsQ0FBUDtBQVpKOztBQVJGLEc7QUFEUyxDQUFYOztlQXVCZSxRIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcm92aWRlcyB0aGUgZGlzcGF0Y2hpbmcgbG9naWMgc28gU2t5IGFwcHMgZG9uJ3QgbmVlZCB0byBrbm93IGhvdyB3ZVxuIyBzdHJ1Y3R1cmUgdGhpbmdzLlxuaW1wb3J0IHJlc3BvbnNlIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5cbmRpc3BhdGNoID0gKGhhbmRsZXJzKSAtPlxuICAocmVxdWVzdCwgY29udGV4dCwgY2FsbGJhY2spIC0+XG4gICAgbG9nZ2VyLmRlYnVnIFwiRGlzcGF0Y2hpbmcgdG8gJyN7Y29udGV4dC5mdW5jdGlvbk5hbWV9JyBoYW5kbGVyXCJcbiAgICBoYW5kbGVyID0gaGFuZGxlcnNbY29udGV4dC5mdW5jdGlvbk5hbWVdXG4gICAgdW5sZXNzIHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbidcbiAgICAgIGxvZ2dlci5lcnJvciBjb250ZXh0LmZ1bmN0aW9uTmFtZSArIFwiSXMgbm90IGEgZnVuY3Rpb25cIlxuICAgICAgcmV0dXJuIGNhbGxiYWNrIFwiPGludGVybmFsIHNlcnZlciBlcnJvcj5cIlxuXG4gICAgcmVxdWVzdC5sYW1iZGFDb250ZXh0ID0gY29udGV4dFxuICAgIHRyeVxuICAgICAgY2FsbGJhY2sgbnVsbCwgKGF3YWl0IGhhbmRsZXIgcmVxdWVzdCkucmVzcG9uc2VcbiAgICBjYXRjaCBlXG4gICAgICB7c3RhY2ssIHRhZz1cImludGVybmFsIHNlcnZlciBlcnJvclwiLCByZWFzb249XCJcIiwgbWVzc2FnZT1cIlwifSA9IGVcbiAgICAgIGlmIHRhZyA9PSBcIm5vdCBtb2RpZmllZFwiXG4gICAgICAgIGxvZ2dlci5kZWJ1ZyBcIjMwNCByZXBseVwiXG4gICAgICAgIHJldHVybiBjYWxsYmFjayBcIjwje3RhZ30+XCJcbiAgICAgIGVsc2VcbiAgICAgICAgbG9nZ2VyLmVycm9yIFwiRXJyb3IgaW4gI3tjb250ZXh0LmZ1bmN0aW9uTmFtZX06IFwiLCBzdGFja1xuICAgICAgICBtc2cgPSBcIjwje3RhZ30+XCJcbiAgICAgICAgbXNnICs9IFwiICN7cmVhc29ufVwiIGlmIHJlYXNvbiAhPSBcIlwiXG4gICAgICAgIG1zZyArPSBcIiAje21lc3NhZ2V9XCIgaWYgbWVzc2FnZSAhPSBcIlwiXG4gICAgICAgIHJldHVybiBjYWxsYmFjayBtc2dcblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=dispatch.coffee
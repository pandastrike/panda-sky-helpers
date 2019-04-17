"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _responses = _interopRequireDefault(require("./responses"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Provides the dispatching logic so Sky apps don't need to know how we
// structure things.
var dispatch;

dispatch = function (handlers) {
  return async function (request, context, callback) {
    var code, data, e, handler, message, metadata, stack, tag;

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
        metadata = {},
        data = {},
        message = ""
      } = e);

      switch (code) {
        case void 0:
          _logger.default.error("Status 500", stack);

          return callback((0, _pandaParchment.toJSON)({
            httpStatus: 500,
            data: {
              message: "<internal server error>"
            }
          }));

        case 304:
          _logger.default.debug("Status 304");

          return callback((0, _pandaParchment.toJSON)({
            httpStatus: 304,
            metadata: metadata,
            data: {
              message: `<${tag}>`
            }
          }));

        default:
          _logger.default.warn(`Status ${code}`, stack);

          return callback((0, _pandaParchment.toJSON)({
            httpStatus: code,
            metadata: metadata,
            data: {
              message: `<${tag}> ${message}`,
              data: data
            }
          }));
      }
    }
  };
};

var _default = dispatch;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQUpBOztBQUFBLElBQUEsUUFBQTs7QUFNQSxRQUFBLEdBQVcsVUFBQSxRQUFBLEVBQUE7U0FDVCxnQkFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUE7O0FBQUEsb0JBQUEsS0FBQSxDQUFhLG1CQUFtQixPQUFPLENBQTFCLFlBQWIsV0FBQTs7QUFDQSxJQUFBLE9BQUEsR0FBVSxRQUFTLENBQUEsT0FBTyxDQUFQLFlBQUEsQ0FBbkI7O0FBQ0EsUUFBTyxPQUFBLE9BQUEsS0FBUCxVQUFBLEVBQUE7QUFDRSxzQkFBQSxLQUFBLENBQWEsT0FBTyxDQUFQLFlBQUEsR0FBYixtQkFBQTs7QUFDQSxhQUFPLFFBQUEsQ0FGVCx5QkFFUyxDQUFQOzs7QUFFRixJQUFBLE9BQU8sQ0FBUCxhQUFBLEdBQXdCLE9BQXhCOztBQUNBLFFBQUE7YUFDRSxRQUFBLENBQUEsSUFBQSxFQUFlLENBQUMsTUFBTSxPQUFBLENBQVAsT0FBTyxDQUFQLEVBRGpCLFFBQ0UsQztBQURGLEtBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUVNLE1BQUEsQ0FBQSxHQUFBLEtBQUE7QUFDSixPQUFBO0FBQUEsUUFBQSxLQUFBO0FBQUEsUUFBQSxJQUFBO0FBQUEsUUFBQSxHQUFBO0FBQW1CLFFBQUEsUUFBQSxHQUFuQixFQUFBO0FBQWdDLFFBQUEsSUFBQSxHQUFoQyxFQUFBO0FBQXlDLFFBQUEsT0FBQSxHQUF6QztBQUFBLFVBQUEsQ0FBQTs7QUFDQSxjQUFBLElBQUE7QUFBQSxhQUNPLEtBRFAsQ0FBQTtBQUVJLDBCQUFBLEtBQUEsQ0FBQSxZQUFBLEVBQUEsS0FBQTs7aUJBQ0EsUUFBQSxDQUFTLDRCQUNQO0FBQUEsWUFBQSxVQUFBLEVBQUEsR0FBQTtBQUNBLFlBQUEsSUFBQSxFQUNFO0FBQUEsY0FBQSxPQUFBLEVBQVM7QUFBVDtBQUZGLFdBRE8sQ0FBVCxDOztBQUhKLGFBQUEsR0FBQTtBQVFJLDBCQUFBLEtBQUEsQ0FBQSxZQUFBOztpQkFDQSxRQUFBLENBQVMsNEJBQ1A7QUFBQSxZQUFBLFVBQUEsRUFBQSxHQUFBO0FBQ0EsWUFBQSxRQUFBLEVBREEsUUFBQTtBQUVBLFlBQUEsSUFBQSxFQUNFO0FBQUEsY0FBQSxPQUFBLEVBQVMsSUFBQSxHQUFBO0FBQVQ7QUFIRixXQURPLENBQVQsQzs7QUFUSjtBQWVJLDBCQUFBLElBQUEsQ0FBWSxVQUFBLElBQVosRUFBQSxFQUFBLEtBQUE7O2lCQUNBLFFBQUEsQ0FBUyw0QkFDUDtBQUFBLFlBQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxZQUFBLFFBQUEsRUFEQSxRQUFBO0FBRUEsWUFBQSxJQUFBLEVBQ0U7QUFBQSxjQUFBLE9BQUEsRUFBUyxJQUFBLEdBQUEsS0FBQSxPQUFULEVBQUE7QUFDQSxjQUFBLElBQUEsRUFBTTtBQUROO0FBSEYsV0FETyxDQUFULEM7QUFoQko7O0FBWkosRztBQURTLENBQVg7O2VBb0NlLFEiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByb3ZpZGVzIHRoZSBkaXNwYXRjaGluZyBsb2dpYyBzbyBTa3kgYXBwcyBkb24ndCBuZWVkIHRvIGtub3cgaG93IHdlXG4jIHN0cnVjdHVyZSB0aGluZ3MuXG5pbXBvcnQge3RvSlNPTiwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHJlc3BvbnNlIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5cbmRpc3BhdGNoID0gKGhhbmRsZXJzKSAtPlxuICAocmVxdWVzdCwgY29udGV4dCwgY2FsbGJhY2spIC0+XG4gICAgbG9nZ2VyLmRlYnVnIFwiRGlzcGF0Y2hpbmcgdG8gJyN7Y29udGV4dC5mdW5jdGlvbk5hbWV9JyBoYW5kbGVyXCJcbiAgICBoYW5kbGVyID0gaGFuZGxlcnNbY29udGV4dC5mdW5jdGlvbk5hbWVdXG4gICAgdW5sZXNzIHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbidcbiAgICAgIGxvZ2dlci5lcnJvciBjb250ZXh0LmZ1bmN0aW9uTmFtZSArIFwiSXMgbm90IGEgZnVuY3Rpb25cIlxuICAgICAgcmV0dXJuIGNhbGxiYWNrIFwiPGludGVybmFsIHNlcnZlciBlcnJvcj5cIlxuXG4gICAgcmVxdWVzdC5sYW1iZGFDb250ZXh0ID0gY29udGV4dFxuICAgIHRyeVxuICAgICAgY2FsbGJhY2sgbnVsbCwgKGF3YWl0IGhhbmRsZXIgcmVxdWVzdCkucmVzcG9uc2VcbiAgICBjYXRjaCBlXG4gICAgICB7c3RhY2ssIGNvZGUsIHRhZywgbWV0YWRhdGE9e30sIGRhdGE9e30sIG1lc3NhZ2U9XCJcIn0gPSBlXG4gICAgICBzd2l0Y2ggY29kZVxuICAgICAgICB3aGVuIHVuZGVmaW5lZFxuICAgICAgICAgIGxvZ2dlci5lcnJvciBcIlN0YXR1cyA1MDBcIiwgc3RhY2tcbiAgICAgICAgICBjYWxsYmFjayB0b0pTT05cbiAgICAgICAgICAgIGh0dHBTdGF0dXM6IDUwMFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCI8aW50ZXJuYWwgc2VydmVyIGVycm9yPlwiXG4gICAgICAgIHdoZW4gMzA0XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnIFwiU3RhdHVzIDMwNFwiXG4gICAgICAgICAgY2FsbGJhY2sgdG9KU09OXG4gICAgICAgICAgICBodHRwU3RhdHVzOiAzMDRcbiAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCI8I3t0YWd9PlwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsb2dnZXIud2FybiBcIlN0YXR1cyAje2NvZGV9XCIsIHN0YWNrXG4gICAgICAgICAgY2FsbGJhY2sgdG9KU09OXG4gICAgICAgICAgICBodHRwU3RhdHVzOiBjb2RlXG4gICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwiPCN7dGFnfT4gI3ttZXNzYWdlfVwiXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGFcblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
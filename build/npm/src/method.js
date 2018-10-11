"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaAuthHeader = require("panda-auth-header");

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var method;

method = function (handler) {
  // TODO: parse Accept header
  // TODO: logging instrumentation
  // TODO: Allow the reaction to CloudWatch events to default to short-circuiting with an optional override based on extracting a special handler from each API file.
  return function (request, context) {
    var header, params, ref, scheme, token;

    if (request.source === "cuddle-monkey") {
      _logger.default.info("Detected a Cuddle Monkey preheater invocation. Short circuting request cycle.");

      return true;
    }

    if ((header = (ref = request.headers) != null ? ref['Authorization'] : void 0) != null) {
      ({
        scheme,
        params,
        token
      } = (0, _pandaAuthHeader.parse)(header));

      if (token) {
        request.authorization = {
          scheme,
          token
        };
      } else {
        request.authorization = {
          scheme,
          params
        };
      }
    }

    return handler(request, context);
  };
};

var _default = method;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGhvZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBREEsSUFBQSxNQUFBOztBQUdBLE1BQUEsR0FBUyxVQUFBLE9BQUEsRUFBQTs7OztTQUtQLFVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQTtBQUNFLFFBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUE7O0FBQUEsUUFBRyxPQUFPLENBQVAsTUFBQSxLQUFILGVBQUEsRUFBQTtBQUNFLHNCQUFBLElBQUEsQ0FBQSwrRUFBQTs7QUFDQSxhQUZGLElBRUU7OztBQUVGLFFBQUcsQ0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxDQUFBLGVBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxLQUFILElBQUEsRUFBQTtBQUNFLE9BQUE7QUFBQSxRQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUE7QUFBQSxRQUFBO0FBQUEsVUFBMEIsNEJBQTFCLE1BQTBCLENBQTFCOztBQUNBLFVBQUEsS0FBQSxFQUFBO0FBQ0UsUUFBQSxPQUFPLENBQVAsYUFBQSxHQUF3QjtBQUFBLFVBQUEsTUFBQTtBQUQxQixVQUFBO0FBQzBCLFNBQXhCO0FBREYsT0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFPLENBQVAsYUFBQSxHQUF3QjtBQUFBLFVBQUEsTUFBQTtBQUgxQixVQUFBO0FBRzBCLFNBQXhCO0FBTEo7OztXQU1BLE9BQUEsQ0FBQSxPQUFBLEVBQUEsT0FBQSxDO0FBWEYsRztBQUxPLENBQVQ7O2VBa0JlLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3BhcnNlfSBmcm9tIFwicGFuZGEtYXV0aC1oZWFkZXJcIlxuaW1wb3J0IGxvZyBmcm9tIFwiLi9sb2dnZXJcIlxuXG5tZXRob2QgPSAoaGFuZGxlcikgLT5cbiAgIyBUT0RPOiBwYXJzZSBBY2NlcHQgaGVhZGVyXG4gICMgVE9ETzogbG9nZ2luZyBpbnN0cnVtZW50YXRpb25cbiAgIyBUT0RPOiBBbGxvdyB0aGUgcmVhY3Rpb24gdG8gQ2xvdWRXYXRjaCBldmVudHMgdG8gZGVmYXVsdCB0byBzaG9ydC1jaXJjdWl0aW5nIHdpdGggYW4gb3B0aW9uYWwgb3ZlcnJpZGUgYmFzZWQgb24gZXh0cmFjdGluZyBhIHNwZWNpYWwgaGFuZGxlciBmcm9tIGVhY2ggQVBJIGZpbGUuXG5cbiAgKHJlcXVlc3QsIGNvbnRleHQpIC0+XG4gICAgaWYgcmVxdWVzdC5zb3VyY2UgPT0gXCJjdWRkbGUtbW9ua2V5XCJcbiAgICAgIGxvZy5pbmZvIFwiRGV0ZWN0ZWQgYSBDdWRkbGUgTW9ua2V5IHByZWhlYXRlciBpbnZvY2F0aW9uLiBTaG9ydCBjaXJjdXRpbmcgcmVxdWVzdCBjeWNsZS5cIlxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmIChoZWFkZXIgPSByZXF1ZXN0LmhlYWRlcnM/WydBdXRob3JpemF0aW9uJ10pP1xuICAgICAge3NjaGVtZSwgcGFyYW1zLCB0b2tlbn0gPSBwYXJzZSBoZWFkZXJcbiAgICAgIGlmIHRva2VuXG4gICAgICAgIHJlcXVlc3QuYXV0aG9yaXphdGlvbiA9IHtzY2hlbWUsIHRva2VufVxuICAgICAgZWxzZVxuICAgICAgICByZXF1ZXN0LmF1dGhvcml6YXRpb24gPSB7c2NoZW1lLCBwYXJhbXN9XG4gICAgaGFuZGxlciByZXF1ZXN0LCBjb250ZXh0XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGhvZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=method.coffee
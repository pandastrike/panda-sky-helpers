"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "env", {
  enumerable: true,
  get: function () {
    return _env.default;
  }
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});
Object.defineProperty(exports, "method", {
  enumerable: true,
  get: function () {
    return _method.default;
  }
});
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function () {
    return _logger.default;
  }
});
Object.defineProperty(exports, "response", {
  enumerable: true,
  get: function () {
    return _responses.default;
  }
});
exports.aws = exports.default = void 0;

require("source-map-support/register");

var _env = _interopRequireDefault(require("./env"));

var _dispatch = _interopRequireDefault(require("./dispatch"));

var _method = _interopRequireDefault(require("./method"));

var _logger = _interopRequireDefault(require("./logger"));

var _responses = _interopRequireDefault(require("./responses"));

var _sundog = _interopRequireDefault(require("sundog"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Before we get started, first install source mapping support.
var aws, sky;
exports.aws = aws;

exports.aws = aws = function (sdk) {
  return (0, _sundog.default)(sdk).AWS;
};

sky = {
  env: _env.default,
  response: _responses.default,
  method: _method.default,
  dispatch: _dispatch.default,
  log: _logger.default,
  aws
};
var _default = sky;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFNQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVpBO0FBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQTs7O0FBY0EsY0FBQSxHQUFBLEdBQU0sVUFBQSxHQUFBLEVBQUE7U0FBUyxxQkFBQSxHQUFBLEVBQVksRztBQUFyQixDQUFOOztBQUVBLEdBQUEsR0FBTTtBQUNKLEVBQUEsR0FESSxFQUNKLFlBREk7QUFFSixFQUFBLFFBRkksRUFFSixrQkFGSTtBQUdKLEVBQUEsTUFISSxFQUdKLGVBSEk7QUFJSixFQUFBLFFBSkksRUFJSixpQkFKSTtBQUtKLEVBQUEsR0FMSSxFQUtKLGVBTEk7QUFBQSxFQUFBO0FBQUEsQ0FBTjtlQVNlLEciLCJzb3VyY2VzQ29udGVudCI6WyIjIEJlZm9yZSB3ZSBnZXQgc3RhcnRlZCwgZmlyc3QgaW5zdGFsbCBzb3VyY2UgbWFwcGluZyBzdXBwb3J0LlxuaW1wb3J0IFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCJcblxuIyBUaGUgbGlicmFyeSByb290IGFjY2VwdHMgYW4gaW5zdGFuY2lhdGVkIEFXUyBTREsgd2hlbiBpbnZva2VkLiAgVGhpcyBnaXZlcyB0aGVcbiMgaGVscGVycyB0aGUgc2FtZSBhY2Nlc3MgYXMgdGhlIGludm9raW5nIExhbWJkYS4gIFdlIHRoZW4gcGFzcyB0aGF0IG9mZiB0byBvdXJcbiMgZnVuY3Rpb25hbCB3cmFwcGVyIGxpYnJhcnkgU3VuRG9nIHRvIGFjY2VzcyBhIHJlYWxseSBwb3dlcmZ1bCBpbnRlcmZhY2UuXG5cbmltcG9ydCBlbnYgZnJvbSBcIi4vZW52XCJcbmltcG9ydCBkaXNwYXRjaCBmcm9tIFwiLi9kaXNwYXRjaFwiXG5pbXBvcnQgbWV0aG9kIGZyb20gXCIuL21ldGhvZFwiXG5pbXBvcnQgbG9nIGZyb20gXCIuL2xvZ2dlclwiXG5pbXBvcnQgcmVzcG9uc2UgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCBTdW5kb2cgZnJvbSBcInN1bmRvZ1wiXG5cbmF3cyA9IChzZGspIC0+IFN1bmRvZyhzZGspLkFXU1xuXG5za3kgPSB7XG4gIGVudlxuICByZXNwb25zZVxuICBtZXRob2RcbiAgZGlzcGF0Y2hcbiAgbG9nXG4gIGF3c1xufVxuXG5leHBvcnQgZGVmYXVsdCBza3lcbmV4cG9ydCB7XG4gIGVudlxuICByZXNwb25zZVxuICBtZXRob2RcbiAgZGlzcGF0Y2hcbiAgbG9nXG4gIGF3c1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/index.coffee
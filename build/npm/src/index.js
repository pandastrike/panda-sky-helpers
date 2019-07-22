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
Object.defineProperty(exports, "log", {
  enumerable: true,
  get: function () {
    return _logger.default;
  }
});
Object.defineProperty(exports, "responses", {
  enumerable: true,
  get: function () {
    return _responses.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "dispatcher", {
  enumerable: true,
  get: function () {
    return _dispatcher.default;
  }
});
Object.defineProperty(exports, "classify", {
  enumerable: true,
  get: function () {
    return _classify.default;
  }
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});
Object.defineProperty(exports, "timeCheck", {
  enumerable: true,
  get: function () {
    return _cache.timeCheck;
  }
});
Object.defineProperty(exports, "hashCheck", {
  enumerable: true,
  get: function () {
    return _cache.hashCheck;
  }
});
exports.aws = exports.default = void 0;

require("source-map-support/register");

var _sundog = _interopRequireDefault(require("sundog"));

var _env = _interopRequireDefault(require("./env"));

var _logger = _interopRequireDefault(require("./logger"));

var _responses = _interopRequireDefault(require("./responses"));

var _parse = _interopRequireDefault(require("./parse"));

var _dispatcher = _interopRequireDefault(require("./dispatcher"));

var _classify = _interopRequireDefault(require("./classify"));

var _dispatch = _interopRequireDefault(require("./dispatch"));

var _cache = require("./cache");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Before we get started, first install source mapping support.
var aws, sky;
exports.aws = aws;

exports.aws = aws = function (sdk) {
  return (0, _sundog.default)(sdk).AWS;
};

sky = {
  env: _env.default,
  log: _logger.default,
  aws,
  responses: _responses.default,
  parse: _parse.default,
  dispatcher: _dispatcher.default,
  classify: _classify.default,
  dispatch: _dispatch.default,
  timeCheck: _cache.timeCheck,
  hashCheck: _cache.hashCheck
};
var _default = sky;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVhBO0FBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQTs7O0FBYUEsY0FBQSxHQUFBLEdBQU0sVUFBQSxHQUFBLEVBQUE7U0FBUyxxQkFBQSxHQUFBLEVBQVksRztBQUFyQixDQUFOOztBQUVBLEdBQUEsR0FBTTtBQUNKLEVBQUEsR0FESSxFQUNKLFlBREk7QUFFSixFQUFBLEdBRkksRUFFSixlQUZJO0FBQUEsRUFBQSxHQUFBO0FBSUosRUFBQSxTQUpJLEVBSUosa0JBSkk7QUFLSixFQUFBLEtBTEksRUFLSixjQUxJO0FBTUosRUFBQSxVQU5JLEVBTUosbUJBTkk7QUFPSixFQUFBLFFBUEksRUFPSixpQkFQSTtBQVFKLEVBQUEsUUFSSSxFQVFKLGlCQVJJO0FBU0osRUFBQSxTQVRJLEVBU0osZ0JBVEk7QUFVSixFQUFBLFNBVkksRUFVSjtBQVZJLENBQU47ZUFhZSxHIiwic291cmNlc0NvbnRlbnQiOlsiIyBCZWZvcmUgd2UgZ2V0IHN0YXJ0ZWQsIGZpcnN0IGluc3RhbGwgc291cmNlIG1hcHBpbmcgc3VwcG9ydC5cbmltcG9ydCBcInNvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlclwiXG5pbXBvcnQgU3VuZG9nIGZyb20gXCJzdW5kb2dcIlxuXG5pbXBvcnQgZW52IGZyb20gXCIuL2VudlwiXG5pbXBvcnQgbG9nIGZyb20gXCIuL2xvZ2dlclwiXG5pbXBvcnQgcmVzcG9uc2VzIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQgcGFyc2UgZnJvbSBcIi4vcGFyc2VcIlxuaW1wb3J0IGRpc3BhdGNoZXIgZnJvbSBcIi4vZGlzcGF0Y2hlclwiXG5pbXBvcnQgY2xhc3NpZnkgZnJvbSBcIi4vY2xhc3NpZnlcIlxuaW1wb3J0IGRpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoXCJcbmltcG9ydCB7dGltZUNoZWNrLCBoYXNoQ2hlY2t9IGZyb20gXCIuL2NhY2hlXCJcblxuYXdzID0gKHNkaykgLT4gU3VuZG9nKHNkaykuQVdTXG5cbnNreSA9IHtcbiAgZW52XG4gIGxvZ1xuICBhd3NcbiAgcmVzcG9uc2VzXG4gIHBhcnNlXG4gIGRpc3BhdGNoZXJcbiAgY2xhc3NpZnlcbiAgZGlzcGF0Y2hcbiAgdGltZUNoZWNrXG4gIGhhc2hDaGVja1xufVxuXG5leHBvcnQgZGVmYXVsdCBza3lcbmV4cG9ydCB7XG4gIGVudlxuICBsb2dcbiAgYXdzXG4gIHJlc3BvbnNlc1xuICBwYXJzZVxuICBkaXNwYXRjaGVyXG4gIGNsYXNzaWZ5XG4gIGRpc3BhdGNoXG4gIHRpbWVDaGVja1xuICBoYXNoQ2hlY2tcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/index.coffee
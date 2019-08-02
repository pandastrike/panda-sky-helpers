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
Object.defineProperty(exports, "meter", {
  enumerable: true,
  get: function () {
    return _meter.default;
  }
});
Object.defineProperty(exports, "responses", {
  enumerable: true,
  get: function () {
    return _responses.default;
  }
});
Object.defineProperty(exports, "load", {
  enumerable: true,
  get: function () {
    return _load.default;
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

var _meter = _interopRequireDefault(require("./meter"));

var _responses = _interopRequireDefault(require("./responses"));

var _load = _interopRequireDefault(require("./load"));

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
  meter: _meter.default,
  aws,
  responses: _responses.default,
  load: _load.default,
  dispatcher: _dispatcher.default,
  classify: _classify.default,
  dispatch: _dispatch.default,
  timeCheck: _cache.timeCheck,
  hashCheck: _cache.hashCheck
};
var _default = sky;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVpBO0FBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQTs7O0FBY0EsY0FBQSxHQUFBLEdBQU0sVUFBQSxHQUFBLEVBQUE7U0FBUyxxQkFBQSxHQUFBLEVBQVksRztBQUFyQixDQUFOOztBQUVBLEdBQUEsR0FBTTtBQUNKLEVBQUEsR0FESSxFQUNKLFlBREk7QUFFSixFQUFBLEdBRkksRUFFSixlQUZJO0FBR0osRUFBQSxLQUhJLEVBR0osY0FISTtBQUFBLEVBQUEsR0FBQTtBQUtKLEVBQUEsU0FMSSxFQUtKLGtCQUxJO0FBTUosRUFBQSxJQU5JLEVBTUosYUFOSTtBQU9KLEVBQUEsVUFQSSxFQU9KLG1CQVBJO0FBUUosRUFBQSxRQVJJLEVBUUosaUJBUkk7QUFTSixFQUFBLFFBVEksRUFTSixpQkFUSTtBQVVKLEVBQUEsU0FWSSxFQVVKLGdCQVZJO0FBV0osRUFBQSxTQVhJLEVBV0o7QUFYSSxDQUFOO2VBY2UsRyIsInNvdXJjZXNDb250ZW50IjpbIiMgQmVmb3JlIHdlIGdldCBzdGFydGVkLCBmaXJzdCBpbnN0YWxsIHNvdXJjZSBtYXBwaW5nIHN1cHBvcnQuXG5pbXBvcnQgXCJzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXJcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcblxuaW1wb3J0IGVudiBmcm9tIFwiLi9lbnZcIlxuaW1wb3J0IGxvZyBmcm9tIFwiLi9sb2dnZXJcIlxuaW1wb3J0IG1ldGVyIGZyb20gXCIuL21ldGVyXCJcbmltcG9ydCByZXNwb25zZXMgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCBsb2FkIGZyb20gXCIuL2xvYWRcIlxuaW1wb3J0IGRpc3BhdGNoZXIgZnJvbSBcIi4vZGlzcGF0Y2hlclwiXG5pbXBvcnQgY2xhc3NpZnkgZnJvbSBcIi4vY2xhc3NpZnlcIlxuaW1wb3J0IGRpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoXCJcbmltcG9ydCB7dGltZUNoZWNrLCBoYXNoQ2hlY2t9IGZyb20gXCIuL2NhY2hlXCJcblxuYXdzID0gKHNkaykgLT4gU3VuZG9nKHNkaykuQVdTXG5cbnNreSA9IHtcbiAgZW52XG4gIGxvZ1xuICBtZXRlclxuICBhd3NcbiAgcmVzcG9uc2VzXG4gIGxvYWRcbiAgZGlzcGF0Y2hlclxuICBjbGFzc2lmeVxuICBkaXNwYXRjaFxuICB0aW1lQ2hlY2tcbiAgaGFzaENoZWNrXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNreVxuZXhwb3J0IHtcbiAgZW52XG4gIGxvZ1xuICBtZXRlclxuICBhd3NcbiAgcmVzcG9uc2VzXG4gIGxvYWRcbiAgZGlzcGF0Y2hlclxuICBjbGFzc2lmeVxuICBkaXNwYXRjaFxuICB0aW1lQ2hlY2tcbiAgaGFzaENoZWNrXG59XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/index.coffee
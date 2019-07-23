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
Object.defineProperty(exports, "method", {
  enumerable: true,
  get: function () {
    return _method.default;
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

var _responses = _interopRequireDefault(require("./responses"));

var _method = _interopRequireDefault(require("./method"));

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
  aws,
  responses: _responses.default,
  method: _method.default,
  load: _load.default,
  dispatcher: _dispatcher.default,
  classify: _classify.default,
  dispatch: _dispatch.default,
  timeCheck: _cache.timeCheck,
  hashCheck: _cache.hashCheck
};
var _default = sky;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVpBO0FBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQTs7O0FBY0EsY0FBQSxHQUFBLEdBQU0sVUFBQSxHQUFBLEVBQUE7U0FBUyxxQkFBQSxHQUFBLEVBQVksRztBQUFyQixDQUFOOztBQUVBLEdBQUEsR0FBTTtBQUNKLEVBQUEsR0FESSxFQUNKLFlBREk7QUFFSixFQUFBLEdBRkksRUFFSixlQUZJO0FBQUEsRUFBQSxHQUFBO0FBSUosRUFBQSxTQUpJLEVBSUosa0JBSkk7QUFLSixFQUFBLE1BTEksRUFLSixlQUxJO0FBTUosRUFBQSxJQU5JLEVBTUosYUFOSTtBQU9KLEVBQUEsVUFQSSxFQU9KLG1CQVBJO0FBUUosRUFBQSxRQVJJLEVBUUosaUJBUkk7QUFTSixFQUFBLFFBVEksRUFTSixpQkFUSTtBQVVKLEVBQUEsU0FWSSxFQVVKLGdCQVZJO0FBV0osRUFBQSxTQVhJLEVBV0o7QUFYSSxDQUFOO2VBY2UsRyIsInNvdXJjZXNDb250ZW50IjpbIiMgQmVmb3JlIHdlIGdldCBzdGFydGVkLCBmaXJzdCBpbnN0YWxsIHNvdXJjZSBtYXBwaW5nIHN1cHBvcnQuXG5pbXBvcnQgXCJzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXJcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcblxuaW1wb3J0IGVudiBmcm9tIFwiLi9lbnZcIlxuaW1wb3J0IGxvZyBmcm9tIFwiLi9sb2dnZXJcIlxuaW1wb3J0IHJlc3BvbnNlcyBmcm9tIFwiLi9yZXNwb25zZXNcIlxuaW1wb3J0IG1ldGhvZCBmcm9tIFwiLi9tZXRob2RcIlxuaW1wb3J0IGxvYWQgZnJvbSBcIi4vbG9hZFwiXG5pbXBvcnQgZGlzcGF0Y2hlciBmcm9tIFwiLi9kaXNwYXRjaGVyXCJcbmltcG9ydCBjbGFzc2lmeSBmcm9tIFwiLi9jbGFzc2lmeVwiXG5pbXBvcnQgZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2hcIlxuaW1wb3J0IHt0aW1lQ2hlY2ssIGhhc2hDaGVja30gZnJvbSBcIi4vY2FjaGVcIlxuXG5hd3MgPSAoc2RrKSAtPiBTdW5kb2coc2RrKS5BV1Ncblxuc2t5ID0ge1xuICBlbnZcbiAgbG9nXG4gIGF3c1xuICByZXNwb25zZXNcbiAgbWV0aG9kXG4gIGxvYWRcbiAgZGlzcGF0Y2hlclxuICBjbGFzc2lmeVxuICBkaXNwYXRjaFxuICB0aW1lQ2hlY2tcbiAgaGFzaENoZWNrXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNreVxuZXhwb3J0IHtcbiAgZW52XG4gIGxvZ1xuICBhd3NcbiAgcmVzcG9uc2VzXG4gIG1ldGhvZFxuICBsb2FkXG4gIGRpc3BhdGNoZXJcbiAgY2xhc3NpZnlcbiAgZGlzcGF0Y2hcbiAgdGltZUNoZWNrXG4gIGhhc2hDaGVja1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/index.coffee
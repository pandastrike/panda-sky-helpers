"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVZBO0FBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQTs7O0FBWUEsY0FBQSxHQUFBLEdBQU0sVUFBQSxHQUFBLEVBQUE7U0FBUyxxQkFBQSxHQUFBLEVBQVksRztBQUFyQixDQUFOOztBQUVBLEdBQUEsR0FBTTtBQUNKLEVBQUEsS0FESSxFQUNKLGNBREk7QUFBQSxFQUFBLEdBQUE7QUFHSixFQUFBLFNBSEksRUFHSixrQkFISTtBQUlKLEVBQUEsSUFKSSxFQUlKLGFBSkk7QUFLSixFQUFBLFVBTEksRUFLSixtQkFMSTtBQU1KLEVBQUEsUUFOSSxFQU1KLGlCQU5JO0FBT0osRUFBQSxRQVBJLEVBT0osaUJBUEk7QUFRSixFQUFBLFNBUkksRUFRSixnQkFSSTtBQVNKLEVBQUEsU0FUSSxFQVNKO0FBVEksQ0FBTjtlQVllLEciLCJzb3VyY2VzQ29udGVudCI6WyIjIEJlZm9yZSB3ZSBnZXQgc3RhcnRlZCwgZmlyc3QgaW5zdGFsbCBzb3VyY2UgbWFwcGluZyBzdXBwb3J0LlxuaW1wb3J0IFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCJcbmltcG9ydCBTdW5kb2cgZnJvbSBcInN1bmRvZ1wiXG5cbmltcG9ydCBtZXRlciBmcm9tIFwiLi9tZXRlclwiXG5pbXBvcnQgcmVzcG9uc2VzIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQgbG9hZCBmcm9tIFwiLi9sb2FkXCJcbmltcG9ydCBkaXNwYXRjaGVyIGZyb20gXCIuL2Rpc3BhdGNoZXJcIlxuaW1wb3J0IGNsYXNzaWZ5IGZyb20gXCIuL2NsYXNzaWZ5XCJcbmltcG9ydCBkaXNwYXRjaCBmcm9tIFwiLi9kaXNwYXRjaFwiXG5pbXBvcnQge3RpbWVDaGVjaywgaGFzaENoZWNrfSBmcm9tIFwiLi9jYWNoZVwiXG5cbmF3cyA9IChzZGspIC0+IFN1bmRvZyhzZGspLkFXU1xuXG5za3kgPSB7XG4gIG1ldGVyXG4gIGF3c1xuICByZXNwb25zZXNcbiAgbG9hZFxuICBkaXNwYXRjaGVyXG4gIGNsYXNzaWZ5XG4gIGRpc3BhdGNoXG4gIHRpbWVDaGVja1xuICBoYXNoQ2hlY2tcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2t5XG5leHBvcnQge1xuICBtZXRlclxuICBhd3NcbiAgcmVzcG9uc2VzXG4gIGxvYWRcbiAgZGlzcGF0Y2hlclxuICBjbGFzc2lmeVxuICBkaXNwYXRjaFxuICB0aW1lQ2hlY2tcbiAgaGFzaENoZWNrXG59XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/index.coffee
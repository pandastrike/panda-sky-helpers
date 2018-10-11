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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBTUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFaQTtBQUFBLElBQUEsR0FBQSxFQUFBLEdBQUE7OztBQWNBLGNBQUEsR0FBQSxHQUFNLFVBQUEsR0FBQSxFQUFBO1NBQVMscUJBQUEsR0FBQSxFQUFZLEc7QUFBckIsQ0FBTjs7QUFFQSxHQUFBLEdBQU07QUFDSixFQUFBLEdBREksRUFDSixZQURJO0FBRUosRUFBQSxRQUZJLEVBRUosa0JBRkk7QUFHSixFQUFBLE1BSEksRUFHSixlQUhJO0FBSUosRUFBQSxRQUpJLEVBSUosaUJBSkk7QUFLSixFQUFBLEdBTEksRUFLSixlQUxJO0FBQUEsRUFBQTtBQUFBLENBQU47ZUFTZSxHIiwic291cmNlc0NvbnRlbnQiOlsiIyBCZWZvcmUgd2UgZ2V0IHN0YXJ0ZWQsIGZpcnN0IGluc3RhbGwgc291cmNlIG1hcHBpbmcgc3VwcG9ydC5cbmltcG9ydCBcInNvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlclwiXG5cbiMgVGhlIGxpYnJhcnkgcm9vdCBhY2NlcHRzIGFuIGluc3RhbmNpYXRlZCBBV1MgU0RLIHdoZW4gaW52b2tlZC4gIFRoaXMgZ2l2ZXMgdGhlXG4jIGhlbHBlcnMgdGhlIHNhbWUgYWNjZXNzIGFzIHRoZSBpbnZva2luZyBMYW1iZGEuICBXZSB0aGVuIHBhc3MgdGhhdCBvZmYgdG8gb3VyXG4jIGZ1bmN0aW9uYWwgd3JhcHBlciBsaWJyYXJ5IFN1bkRvZyB0byBhY2Nlc3MgYSByZWFsbHkgcG93ZXJmdWwgaW50ZXJmYWNlLlxuXG5pbXBvcnQgZW52IGZyb20gXCIuL2VudlwiXG5pbXBvcnQgZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2hcIlxuaW1wb3J0IG1ldGhvZCBmcm9tIFwiLi9tZXRob2RcIlxuaW1wb3J0IGxvZyBmcm9tIFwiLi9sb2dnZXJcIlxuaW1wb3J0IHJlc3BvbnNlIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQgU3VuZG9nIGZyb20gXCJzdW5kb2dcIlxuXG5hd3MgPSAoc2RrKSAtPiBTdW5kb2coc2RrKS5BV1Ncblxuc2t5ID0ge1xuICBlbnZcbiAgcmVzcG9uc2VcbiAgbWV0aG9kXG4gIGRpc3BhdGNoXG4gIGxvZ1xuICBhd3Ncbn1cblxuZXhwb3J0IGRlZmF1bHQgc2t5XG5leHBvcnQge1xuICBlbnZcbiAgcmVzcG9uc2VcbiAgbWV0aG9kXG4gIGRpc3BhdGNoXG4gIGxvZ1xuICBhd3Ncbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=index.coffee
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _pandaAuthHeader = require("panda-auth-header");

var _logger = _interopRequireDefault(require("./logger"));

var _responses = _interopRequireDefault(require("./responses"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cache, NotModified, md5, method;
({
  NotModified
} = _responses.default);

md5 = function (obj) {
  return _crypto.default.createHash('md5').update(JSON.stringify(obj), 'utf-8').digest("hex");
};

Cache = class Cache {
  constructor(request) {
    var ref;
    this.timestamp = null;
    this.inputTime = (ref = request.headers) != null ? ref["if-modified-since"] : void 0;
  }

  check(timestamp) {
    timestamp = new Date(Number(timestamp)).toUTCString();

    if (timestamp === this.inputTime) {
      throw new NotModified();
    } else {
      return this.timestamp = timestamp;
    }
  }

};

method = function (signatures, handler) {
  // TODO: parse Accept header
  return async function (request, context) {
    var cache, data, etag, header, params, ref, ref1, ref2, ref3, scheme, token;

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
    } // Process the handler while minding the conditional cache headers.


    if ((ref1 = signatures.response.cache) != null ? ref1.lastModified : void 0) {
      _logger.default.debug("incoming headers for Last-Modified", request.headers);

      cache = new Cache(request);
      data = await handler(request, context, cache);
      console.log(cache);
      return {
        data: data,
        metadata: {
          headers: {
            lastModified: cache.timestamp
          }
        }
      };
    } else if ((ref2 = signatures.response.cache) != null ? ref2.etag : void 0) {
      _logger.default.debug("incoming headers for ETag", request.headers);

      data = await handler(request, context);
      etag = md5(data);

      if (((ref3 = request.headers) != null ? ref3["if-none-match"] : void 0) === etag) {
        throw new NotModified();
      }

      return {
        data: data,
        metadata: {
          headers: {
            etag
          }
        }
      };
    } else {
      return {
        data: await handler(request, context)
      };
    }
  };
};

var _default = method;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,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WUFBQSxZQUFBLEVBQWMsS0FBSyxDQUFDO0FBQXBCO0FBQVQ7QUFEVixPQURGO0FBTEYsS0FBQSxNQVNLLElBQUEsQ0FBQSxJQUFBLEdBQUEsVUFBQSxDQUFBLFFBQUEsQ0FBQSxLQUFBLEtBQUEsSUFBQSxHQUFBLElBQTRCLENBQUUsSUFBOUIsR0FBOEIsS0FBOUIsQ0FBQSxFQUFBO0FBQ0gsc0JBQUEsS0FBQSxDQUFBLDJCQUFBLEVBQXVDLE9BQU8sQ0FBOUMsT0FBQTs7QUFDQSxNQUFBLElBQUEsR0FBTyxNQUFNLE9BQUEsQ0FBQSxPQUFBLEVBQU4sT0FBTSxDQUFiO0FBQ0EsTUFBQSxJQUFBLEdBQU8sR0FBQSxDQUFBLElBQUEsQ0FBUDs7QUFDQSxVQUFBLENBQUEsQ0FBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLE9BQUEsS0FBQSxJQUFBLEdBQUEsSUFBb0IsQ0FBQSxlQUFBLENBQXBCLEdBQW9CLEtBQWpCLENBQUgsTUFBQSxJQUFBLEVBQUE7QUFDRSxjQUFNLElBRFIsV0FDUSxFQUFOOzs7QUFDRixhQUNFO0FBQUEsUUFBQSxJQUFBLEVBQUEsSUFBQTtBQUNBLFFBQUEsUUFBQSxFQUFVO0FBQUEsVUFBQSxPQUFBLEVBQVM7QUFBQSxZQUFBO0FBQUE7QUFBVDtBQURWLE9BREY7QUFORyxLQUFBLE1BQUE7YUFXSDtBQUFBLFFBQUEsSUFBQSxFQUFNLE1BQU0sT0FBQSxDQUFBLE9BQUEsRUFBTixPQUFNO0FBQVosTzs7QUFqQ0osRztBQUZPLENBQVQ7O2VBcUNlLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ3J5cHRvIGZyb20gXCJjcnlwdG9cIlxuaW1wb3J0IHtwYXJzZX0gZnJvbSBcInBhbmRhLWF1dGgtaGVhZGVyXCJcbmltcG9ydCBsb2cgZnJvbSBcIi4vbG9nZ2VyXCJcbmltcG9ydCByZXNwb25zZXMgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbntOb3RNb2RpZmllZH0gPSByZXNwb25zZXNcblxubWQ1ID0gKG9iaikgLT5cbiAgQ3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShKU09OLnN0cmluZ2lmeShvYmopLCAndXRmLTgnKS5kaWdlc3QoXCJoZXhcIilcblxuY2xhc3MgQ2FjaGVcbiAgY29uc3RydWN0b3I6IChyZXF1ZXN0KSAtPlxuICAgIEB0aW1lc3RhbXAgPSBudWxsXG4gICAgQGlucHV0VGltZSA9IHJlcXVlc3QuaGVhZGVycz9bXCJpZi1tb2RpZmllZC1zaW5jZVwiXVxuXG4gIGNoZWNrOiAodGltZXN0YW1wKSAtPlxuICAgIHRpbWVzdGFtcCA9IG5ldyBEYXRlKE51bWJlciB0aW1lc3RhbXApLnRvVVRDU3RyaW5nKClcbiAgICBpZiB0aW1lc3RhbXAgPT0gQGlucHV0VGltZVxuICAgICAgdGhyb3cgbmV3IE5vdE1vZGlmaWVkKClcbiAgICBlbHNlXG4gICAgICBAdGltZXN0YW1wID0gdGltZXN0YW1wXG5cbm1ldGhvZCA9IChzaWduYXR1cmVzLCBoYW5kbGVyKSAtPlxuICAjIFRPRE86IHBhcnNlIEFjY2VwdCBoZWFkZXJcbiAgKHJlcXVlc3QsIGNvbnRleHQpIC0+XG4gICAgaWYgcmVxdWVzdC5zb3VyY2UgPT0gXCJjdWRkbGUtbW9ua2V5XCJcbiAgICAgIGxvZy5pbmZvIFwiRGV0ZWN0ZWQgYSBDdWRkbGUgTW9ua2V5IHByZWhlYXRlciBpbnZvY2F0aW9uLiBTaG9ydCBjaXJjdXRpbmcgcmVxdWVzdCBjeWNsZS5cIlxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmIChoZWFkZXIgPSByZXF1ZXN0LmhlYWRlcnM/WydBdXRob3JpemF0aW9uJ10pP1xuICAgICAge3NjaGVtZSwgcGFyYW1zLCB0b2tlbn0gPSBwYXJzZSBoZWFkZXJcbiAgICAgIGlmIHRva2VuXG4gICAgICAgIHJlcXVlc3QuYXV0aG9yaXphdGlvbiA9IHtzY2hlbWUsIHRva2VufVxuICAgICAgZWxzZVxuICAgICAgICByZXF1ZXN0LmF1dGhvcml6YXRpb24gPSB7c2NoZW1lLCBwYXJhbXN9XG5cbiAgICAjIFByb2Nlc3MgdGhlIGhhbmRsZXIgd2hpbGUgbWluZGluZyB0aGUgY29uZGl0aW9uYWwgY2FjaGUgaGVhZGVycy5cbiAgICBpZiBzaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlPy5sYXN0TW9kaWZpZWRcbiAgICAgIGxvZy5kZWJ1ZyBcImluY29taW5nIGhlYWRlcnMgZm9yIExhc3QtTW9kaWZpZWRcIiwgcmVxdWVzdC5oZWFkZXJzXG4gICAgICBjYWNoZSA9IG5ldyBDYWNoZSByZXF1ZXN0XG4gICAgICBkYXRhID0gYXdhaXQgaGFuZGxlciByZXF1ZXN0LCBjb250ZXh0LCBjYWNoZVxuICAgICAgY29uc29sZS5sb2cgY2FjaGVcbiAgICAgIHJldHVyblxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIG1ldGFkYXRhOiBoZWFkZXJzOiBsYXN0TW9kaWZpZWQ6IGNhY2hlLnRpbWVzdGFtcFxuXG4gICAgZWxzZSBpZiBzaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlPy5ldGFnXG4gICAgICBsb2cuZGVidWcgXCJpbmNvbWluZyBoZWFkZXJzIGZvciBFVGFnXCIsIHJlcXVlc3QuaGVhZGVyc1xuICAgICAgZGF0YSA9IGF3YWl0IGhhbmRsZXIgcmVxdWVzdCwgY29udGV4dFxuICAgICAgZXRhZyA9IG1kNSBkYXRhXG4gICAgICBpZiByZXF1ZXN0LmhlYWRlcnM/W1wiaWYtbm9uZS1tYXRjaFwiXSA9PSBldGFnXG4gICAgICAgIHRocm93IG5ldyBOb3RNb2RpZmllZCgpXG4gICAgICByZXR1cm5cbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICBtZXRhZGF0YTogaGVhZGVyczoge2V0YWd9XG5cbiAgICBlbHNlXG4gICAgICBkYXRhOiBhd2FpdCBoYW5kbGVyIHJlcXVlc3QsIGNvbnRleHRcblxuZXhwb3J0IGRlZmF1bHQgbWV0aG9kXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=method.coffee
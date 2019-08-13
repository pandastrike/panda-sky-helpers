"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _pandaGarden = require("panda-garden");

var _pandaParchment = require("panda-parchment");

var _responses = _interopRequireDefault(require("./responses"));

var _cache = require("./cache");

var _cors = require("./cors");

var _compress = require("./compress");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatch, execute, matchCache, matchEncoding, matchHeaders, matchStatus, respond, stamp;

execute = async function (context) {
  var f, handlers, method, resource;
  ({
    handlers,
    match: {
      data: {
        resource
      },
      method
    }
  } = context);
  console.log(resource, method);

  if (!(f = handlers[(0, _pandaParchment.dashed)(resource)][(0, _pandaParchment.toLower)(method)])) {
    throw new _responses.default.NotImplemented(`no handler for ${resource} ${method}`);
  }

  return await f(context);
};

matchEncoding = async function (context) {
  var body, buffer, encodeReady, mediatype;
  ({
    mediatype
  } = context.match.signatures.response);
  ({
    body,
    encodeReady
  } = context.response);

  if (mediatype && body != null && !encodeReady) {
    switch (context.match.acceptEncoding) {
      case "identity":
        if (!(0, _pandaParchment.isString)(body)) {
          context.response.body = (0, _pandaParchment.toJSON)(body);
        }

        context.response.headers["Content-Encoding"] = "identity";
        context.response.isBase64Encoded = false;
        break;

      case "gzip":
        buffer = Buffer.from((0, _cache.toString)(body), "utf8");

        if ((0, _compress.isCompressible)(buffer, context.match.accept)) {
          context.response.body = await (0, _compress.gzip)(buffer);
          context.response.isBase64Encoded = true;
        } else {
          context.match.acceptEncoding = "identity";
          context = matchEncoding(context);
        }

        break;

      default:
        throw new Error(`Bad encoding: ${context.match.acceptEncoding}`);
    }
  }

  return context;
};

matchCache = function (context) {
  var body, cache, current, match, maxAge, sharedMaxAge;
  ({
    response: {
      body
    },
    match
  } = context);

  if (current = (0, _cache.hashCheck)(match, body)) {
    (0, _pandaParchment.include)(context.response.headers, {
      ETag: current
    });
  }

  if ((cache = match.signatures.response.cache) != null) {
    ({
      maxAge,
      sharedMaxAge
    } = cache);

    if (maxAge != null && sharedMaxAge != null) {
      (0, _pandaParchment.include)(context.response.headers, {
        "Cache-Control": `max-age=${maxAge}, s-maxage=${sharedMaxAge}`
      });
    } else if (maxAge != null) {
      (0, _pandaParchment.include)(context.response.headers, {
        "Cache-Control": `max-age=${maxAge}`
      });
    } else if (sharedMaxAge != null) {
      (0, _pandaParchment.include)(context.response.headers, {
        "Cache-Control": `s-maxage=${sharedMaxAge}`
      });
    }
  }

  return context;
};

matchStatus = function (context) {
  var code;
  code = (0, _pandaParchment.first)(context.match.signatures.response.status);
  (0, _pandaParchment.include)(context.response, {
    code
  }, {
    tag: _responses.default[code]
  });
  return context;
};

matchHeaders = function (context) {
  var accept, acceptEncoding, signatures;
  ({
    accept,
    acceptEncoding,
    signatures
  } = context.match);

  if (signatures.response.mediatype) {
    (0, _pandaParchment.include)(context.response.headers, {
      "Content-Type": accept,
      "Content-Encoding": acceptEncoding,
      Vary: "Accept, Accept-Encoding"
    });
  }

  return context;
};

stamp = (0, _pandaGarden.flow)([matchEncoding, matchCache, matchStatus, _cors.matchCORS, matchHeaders]);

respond = function (context) {
  var body, code, headers, isBase64Encoded, method, resource, tag;
  ({
    match: {
      data: {
        resource
      },
      method
    }
  } = context);
  console.log({
    [`${resource}${method}Dispatch`]: ((0, _pandaParchment.microseconds)() - context.start) / 1000
  });
  ({
    code,
    tag,
    headers,
    body,
    isBase64Encoded = false
  } = context.response);
  return {
    statusCode: code,
    statusDescription: tag,
    headers: headers,
    body: body,
    isBase64Encoded: isBase64Encoded
  };
};

dispatch = (0, _pandaGarden.flow)([execute, stamp, respond]);
var _default = dispatch;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQU5BLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7O0FBUUEsT0FBQSxHQUFVLGdCQUFBLE9BQUEsRUFBQTtBQUNSLE1BQUEsQ0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLFFBQUE7QUFBVyxJQUFBLEtBQUEsRUFBTTtBQUFDLE1BQUEsSUFBQSxFQUFLO0FBQU4sUUFBQTtBQUFNLE9BQU47QUFBa0IsTUFBQTtBQUFsQjtBQUFqQixNQUFBLE9BQUE7QUFDQSxFQUFBLE9BQU8sQ0FBUCxHQUFBLENBQUEsUUFBQSxFQUFBLE1BQUE7O0FBRUEsTUFBQSxFQUFPLENBQUEsR0FBSSxRQUFTLENBQUEsNEJBQUEsUUFBQSxDQUFBLENBQVQsQ0FBMEIsNkJBQXJDLE1BQXFDLENBQTFCLENBQVgsQ0FBQSxFQUFBO0FBQ0UsVUFBTSxJQUFJLG1CQUFKLGNBQUEsQ0FBNkIsa0JBQUEsUUFBQSxJQUFBLE1BRHJDLEVBQ1EsQ0FBTjs7O0FBRUYsU0FBQSxNQUFNLENBQUEsQ0FBTixPQUFNLENBQU47QUFQUSxDQUFWOztBQVNBLGFBQUEsR0FBZ0IsZ0JBQUEsT0FBQSxFQUFBO0FBQ2QsTUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQSxTQUFBO0FBQUEsR0FBQTtBQUFBLElBQUE7QUFBQSxNQUFjLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxDQUFkLFFBQUE7QUFDQSxHQUFBO0FBQUEsSUFBQSxJQUFBO0FBQUEsSUFBQTtBQUFBLE1BQXNCLE9BQU8sQ0FBN0IsUUFBQTs7QUFF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LElBQUE7QUFDQSxJQUFBLGlCQUFBLEVBREEsR0FBQTtBQUVBLElBQUEsT0FBQSxFQUZBLE9BQUE7QUFHQSxJQUFBLElBQUEsRUFIQSxJQUFBO0FBSUEsSUFBQSxlQUFBLEVBQWlCO0FBSmpCLEc7QUFQUSxDQUFWOztBQWFBLFFBQUEsR0FBVyx1QkFBSyxDQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUwsT0FBSyxDQUFMLENBQVg7ZUFNZSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQge2Zsb3d9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtmaXJzdCwgaW5jbHVkZSwgZnJvbUpTT04sIHRvSlNPTiwgaXNTdHJpbmcsIGRhc2hlZCwgdG9Mb3dlciwgbWljcm9zZWNvbmRzfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCBSZXNwb25zZXMgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCB7bWQ1LCBoYXNoQ2hlY2ssIHRvU3RyaW5nfSBmcm9tIFwiLi9jYWNoZVwiXG5pbXBvcnQge21hdGNoQ09SU30gZnJvbSBcIi4vY29yc1wiXG5pbXBvcnQge2lzQ29tcHJlc3NpYmxlLCBnemlwfSBmcm9tIFwiLi9jb21wcmVzc1wiXG5cbmV4ZWN1dGUgPSAoY29udGV4dCkgLT5cbiAge2hhbmRsZXJzLCBtYXRjaDp7ZGF0YTp7cmVzb3VyY2V9LCBtZXRob2R9fSA9IGNvbnRleHRcbiAgY29uc29sZS5sb2cgcmVzb3VyY2UsIG1ldGhvZFxuXG4gIHVubGVzcyBmID0gaGFuZGxlcnNbZGFzaGVkIHJlc291cmNlXVt0b0xvd2VyIG1ldGhvZF1cbiAgICB0aHJvdyBuZXcgUmVzcG9uc2VzLk5vdEltcGxlbWVudGVkIFwibm8gaGFuZGxlciBmb3IgI3tyZXNvdXJjZX0gI3ttZXRob2R9XCJcblxuICBhd2FpdCBmIGNvbnRleHRcblxubWF0Y2hFbmNvZGluZyA9IChjb250ZXh0KSAtPlxuICB7bWVkaWF0eXBlfSA9IGNvbnRleHQubWF0Y2guc2lnbmF0dXJlcy5yZXNwb25zZVxuICB7Ym9keSwgZW5jb2RlUmVhZHl9ID0gY29udGV4dC5yZXNwb25zZVxuXG4gIGlmIG1lZGlhdHlwZSAmJiBib2R5PyAmJiAhZW5jb2RlUmVhZHlcbiAgICBzd2l0Y2ggY29udGV4dC5tYXRjaC5hY2NlcHRFbmNvZGluZ1xuICAgICAgd2hlbiBcImlkZW50aXR5XCJcbiAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gdG9KU09OIGJvZHkgdW5sZXNzIGlzU3RyaW5nIGJvZHlcbiAgICAgICAgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzW1wiQ29udGVudC1FbmNvZGluZ1wiXSA9IFwiaWRlbnRpdHlcIlxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IGZhbHNlXG4gICAgICB3aGVuIFwiZ3ppcFwiXG4gICAgICAgIGJ1ZmZlciA9IEJ1ZmZlci5mcm9tICh0b1N0cmluZyBib2R5KSwgXCJ1dGY4XCJcbiAgICAgICAgaWYgaXNDb21wcmVzc2libGUgYnVmZmVyLCBjb250ZXh0Lm1hdGNoLmFjY2VwdFxuICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IGF3YWl0IGd6aXAgYnVmZmVyXG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5pc0Jhc2U2NEVuY29kZWQgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nID0gXCJpZGVudGl0eVwiXG4gICAgICAgICAgY29udGV4dCA9IG1hdGNoRW5jb2RpbmcgY29udGV4dFxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJCYWQgZW5jb2Rpbmc6ICN7Y29udGV4dC5tYXRjaC5hY2NlcHRFbmNvZGluZ31cIlxuXG4gIGNvbnRleHRcblxubWF0Y2hDYWNoZSA9IChjb250ZXh0KSAtPlxuICB7cmVzcG9uc2U6e2JvZHl9LCBtYXRjaH0gPSBjb250ZXh0XG5cbiAgaWYgY3VycmVudCA9IGhhc2hDaGVjayBtYXRjaCwgYm9keVxuICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLCBFVGFnOiBjdXJyZW50XG5cbiAgaWYgKGNhY2hlID0gbWF0Y2guc2lnbmF0dXJlcy5yZXNwb25zZS5jYWNoZSk/XG4gICAge21heEFnZSwgc2hhcmVkTWF4QWdlfSA9IGNhY2hlXG4gICAgaWYgbWF4QWdlPyAmJiBzaGFyZWRNYXhBZ2U/XG4gICAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibWF4LWFnZT0je21heEFnZX0sIHMtbWF4YWdlPSN7c2hhcmVkTWF4QWdlfVwiXG4gICAgZWxzZSBpZiBtYXhBZ2U/XG4gICAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibWF4LWFnZT0je21heEFnZX1cIlxuICAgIGVsc2UgaWYgc2hhcmVkTWF4QWdlP1xuICAgICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInMtbWF4YWdlPSN7c2hhcmVkTWF4QWdlfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaFN0YXR1cyA9IChjb250ZXh0KSAtPlxuICBjb2RlID0gZmlyc3QgY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlLnN0YXR1c1xuICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UsIHtjb2RlfSwgdGFnOiBSZXNwb25zZXNbY29kZV1cbiAgY29udGV4dFxuXG5tYXRjaEhlYWRlcnMgPSAoY29udGV4dCkgLT5cbiAge2FjY2VwdCwgYWNjZXB0RW5jb2RpbmcsIHNpZ25hdHVyZXN9ID0gY29udGV4dC5tYXRjaFxuXG4gIGlmIHNpZ25hdHVyZXMucmVzcG9uc2UubWVkaWF0eXBlXG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBhY2NlcHRcbiAgICAgIFwiQ29udGVudC1FbmNvZGluZ1wiOiBhY2NlcHRFbmNvZGluZ1xuICAgICAgVmFyeTogXCJBY2NlcHQsIEFjY2VwdC1FbmNvZGluZ1wiXG5cbiAgY29udGV4dFxuXG5cblxuXG5zdGFtcCA9IGZsb3cgW1xuICBtYXRjaEVuY29kaW5nXG4gIG1hdGNoQ2FjaGVcbiAgbWF0Y2hTdGF0dXNcbiAgbWF0Y2hDT1JTXG4gIG1hdGNoSGVhZGVyc1xuXVxuXG5yZXNwb25kID0gKGNvbnRleHQpIC0+XG4gIHttYXRjaDp7ZGF0YTp7cmVzb3VyY2V9LCBtZXRob2R9fSA9IGNvbnRleHRcbiAgY29uc29sZS5sb2cgXCIje3Jlc291cmNlfSN7bWV0aG9kfURpc3BhdGNoXCI6XG4gICAgKG1pY3Jvc2Vjb25kcygpIC0gY29udGV4dC5zdGFydCkgLyAxMDAwXG5cbiAge2NvZGUsIHRhZywgaGVhZGVycywgYm9keSwgaXNCYXNlNjRFbmNvZGVkPWZhbHNlfSA9IGNvbnRleHQucmVzcG9uc2VcblxuICBzdGF0dXNDb2RlOiBjb2RlXG4gIHN0YXR1c0Rlc2NyaXB0aW9uOiB0YWdcbiAgaGVhZGVyczogaGVhZGVyc1xuICBib2R5OiBib2R5XG4gIGlzQmFzZTY0RW5jb2RlZDogaXNCYXNlNjRFbmNvZGVkXG5cbmRpc3BhdGNoID0gZmxvdyBbXG4gIGV4ZWN1dGVcbiAgc3RhbXBcbiAgcmVzcG9uZFxuXVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
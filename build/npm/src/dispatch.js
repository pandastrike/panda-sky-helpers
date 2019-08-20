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

  require("source-map-support/register");

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
    [`${(0, _pandaParchment.camelCase)((0, _pandaParchment.plainText)(resource))}${method}Dispatch`]: ((0, _pandaParchment.microseconds)() - context.start) / 1000
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQU5BLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7O0FBUUEsT0FBQSxHQUFVLGdCQUFBLE9BQUEsRUFBQTtBQUNSLE1BQUEsQ0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLFFBQUE7QUFBVyxJQUFBLEtBQUEsRUFBTTtBQUFDLE1BQUEsSUFBQSxFQUFLO0FBQU4sUUFBQTtBQUFNLE9BQU47QUFBa0IsTUFBQTtBQUFsQjtBQUFqQixNQUFBLE9BQUE7QUFDQSxFQUFBLE9BQU8sQ0FBUCxHQUFBLENBQUEsUUFBQSxFQUFBLE1BQUE7O0FBRUEsRUFBQSxPQUFBLENBQUEsNkJBQUEsQ0FBQTs7QUFDQSxNQUFBLEVBQU8sQ0FBQSxHQUFJLFFBQVMsQ0FBQSw0QkFBQSxRQUFBLENBQUEsQ0FBVCxDQUEwQiw2QkFBckMsTUFBcUMsQ0FBMUIsQ0FBWCxDQUFBLEVBQUE7QUFDRSxVQUFNLElBQUksbUJBQUosY0FBQSxDQUE2QixrQkFBQSxRQUFBLElBQUEsTUFEckMsRUFDUSxDQUFOOzs7QUFFRixTQUFBLE1BQU0sQ0FBQSxDQUFOLE9BQU0sQ0FBTjtBQVJRLENBQVY7O0FBVUEsYUFBQSxHQUFnQixnQkFBQSxPQUFBLEVBQUE7QUFDZCxNQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsV0FBQSxFQUFBLFNBQUE7QUFBQSxHQUFBO0FBQUEsSUFBQTtBQUFBLE1BQWMsT0FBTyxDQUFDLEtBQVIsQ0FBYyxVQUFkLENBQWQsUUFBQTtBQUNBLEdBQUE7QUFBQSxJQUFBLElBQUE7QUFBQSxJQUFB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M0I7QUFBQSxNQUFvRCxPQUFPLENBQTNELFFBQUE7U0FFQTtBQUFBLElBQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxJQUFBLGlCQUFBLEVBREEsR0FBQTtBQUVBLElBQUEsT0FBQSxFQUZBLE9BQUE7QUFHQSxJQUFBLElBQUEsRUFIQSxJQUFBO0FBSUEsSUFBQSxlQUFBLEVBQWlCO0FBSmpCLEc7QUFQUSxDQUFWOztBQWFBLFFBQUEsR0FBVyx1QkFBSyxDQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUwsT0FBSyxDQUFMLENBQVg7ZUFNZSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQge2Zsb3d9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtmaXJzdCwgaW5jbHVkZSwgZnJvbUpTT04sIHRvSlNPTiwgaXNTdHJpbmcsIGRhc2hlZCwgdG9Mb3dlciwgbWljcm9zZWNvbmRzLCBwbGFpblRleHQsIGNhbWVsQ2FzZX0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQge21kNSwgaGFzaENoZWNrLCB0b1N0cmluZ30gZnJvbSBcIi4vY2FjaGVcIlxuaW1wb3J0IHttYXRjaENPUlN9IGZyb20gXCIuL2NvcnNcIlxuaW1wb3J0IHtpc0NvbXByZXNzaWJsZSwgZ3ppcH0gZnJvbSBcIi4vY29tcHJlc3NcIlxuXG5leGVjdXRlID0gKGNvbnRleHQpIC0+XG4gIHtoYW5kbGVycywgbWF0Y2g6e2RhdGE6e3Jlc291cmNlfSwgbWV0aG9kfX0gPSBjb250ZXh0XG4gIGNvbnNvbGUubG9nIHJlc291cmNlLCBtZXRob2RcblxuICByZXF1aXJlIFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCJcbiAgdW5sZXNzIGYgPSBoYW5kbGVyc1tkYXNoZWQgcmVzb3VyY2VdW3RvTG93ZXIgbWV0aG9kXVxuICAgIHRocm93IG5ldyBSZXNwb25zZXMuTm90SW1wbGVtZW50ZWQgXCJubyBoYW5kbGVyIGZvciAje3Jlc291cmNlfSAje21ldGhvZH1cIlxuXG4gIGF3YWl0IGYgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIlxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB0b0pTT04gYm9keSB1bmxlc3MgaXNTdHJpbmcgYm9keVxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gZmFsc2VcbiAgICAgIHdoZW4gXCJnemlwXCJcbiAgICAgICAgYnVmZmVyID0gQnVmZmVyLmZyb20gKHRvU3RyaW5nIGJvZHkpLCBcInV0ZjhcIlxuICAgICAgICBpZiBpc0NvbXByZXNzaWJsZSBidWZmZXIsIGNvbnRleHQubWF0Y2guYWNjZXB0XG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gYXdhaXQgZ3ppcCBidWZmZXJcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnRleHQubWF0Y2guYWNjZXB0RW5jb2RpbmcgPSBcImlkZW50aXR5XCJcbiAgICAgICAgICBjb250ZXh0ID0gbWF0Y2hFbmNvZGluZyBjb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcblxuICBpZiAoY2FjaGUgPSBtYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlKT9cbiAgICB7bWF4QWdlLCBzaGFyZWRNYXhBZ2V9ID0gY2FjaGVcbiAgICBpZiBtYXhBZ2U/ICYmIHNoYXJlZE1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfSwgcy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcbiAgICBlbHNlIGlmIG1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfVwiXG4gICAgZWxzZSBpZiBzaGFyZWRNYXhBZ2U/XG4gICAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwicy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoY29udGV4dCkgLT5cbiAge21hdGNoOntkYXRhOntyZXNvdXJjZX0sIG1ldGhvZH19ID0gY29udGV4dFxuICBjb25zb2xlLmxvZyBcIiN7Y2FtZWxDYXNlIHBsYWluVGV4dCByZXNvdXJjZX0je21ldGhvZH1EaXNwYXRjaFwiOlxuICAgIChtaWNyb3NlY29uZHMoKSAtIGNvbnRleHQuc3RhcnQpIC8gMTAwMFxuXG4gIHtjb2RlLCB0YWcsIGhlYWRlcnMsIGJvZHksIGlzQmFzZTY0RW5jb2RlZD1mYWxzZX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgc3RhdHVzQ29kZTogY29kZVxuICBzdGF0dXNEZXNjcmlwdGlvbjogdGFnXG4gIGhlYWRlcnM6IGhlYWRlcnNcbiAgYm9keTogYm9keVxuICBpc0Jhc2U2NEVuY29kZWQ6IGlzQmFzZTY0RW5jb2RlZFxuXG5kaXNwYXRjaCA9IGZsb3cgW1xuICBleGVjdXRlXG4gIHN0YW1wXG4gIHJlc3BvbmRcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
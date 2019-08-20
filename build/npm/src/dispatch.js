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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQU5BLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7O0FBUUEsT0FBQSxHQUFVLGdCQUFBLE9BQUEsRUFBQTtBQUNSLE1BQUEsQ0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLFFBQUE7QUFBVyxJQUFBLEtBQUEsRUFBTTtBQUFDLE1BQUEsSUFBQSxFQUFLO0FBQU4sUUFBQTtBQUFNLE9BQU47QUFBa0IsTUFBQTtBQUFsQjtBQUFqQixNQUFBLE9BQUE7QUFDQSxFQUFBLE9BQU8sQ0FBUCxHQUFBLENBQUEsUUFBQSxFQUFBLE1BQUE7O0FBRUEsTUFBQSxFQUFPLENBQUEsR0FBSSxRQUFTLENBQUEsNEJBQUEsUUFBQSxDQUFBLENBQVQsQ0FBMEIsNkJBQXJDLE1BQXFDLENBQTFCLENBQVgsQ0FBQSxFQUFBO0FBQ0UsVUFBTSxJQUFJLG1CQUFKLGNBQUEsQ0FBNkIsa0JBQUEsUUFBQSxJQUFBLE1BRHJDLEVBQ1EsQ0FBTjs7O0FBRUYsU0FBQSxNQUFNLENBQUEsQ0FBTixPQUFNLENBQU47QUFQUSxDQUFWOztBQVNBLGFBQUEsR0FBZ0IsZ0JBQUEsT0FBQSxFQUFBO0FBQ2QsTUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQSxTQUFBO0FBQUEsR0FBQTtBQUFBLElBQUE7QUFBQSxNQUFjLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxDQUFkLFFBQUE7QUFDQSxHQUFBO0FBQUEsSUFBQSxJQUFBO0FBQUEsSUFBQTtBQUFBLE1BQXNCLE9BQU8sQ0FBN0IsUUFBQTs7QUFF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RUE7QUFBQSxJQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsSUFBQSxpQkFBQSxFQURBLEdBQUE7QUFFQSxJQUFBLE9BQUEsRUFGQSxPQUFBO0FBR0EsSUFBQSxJQUFBLEVBSEEsSUFBQTtBQUlBLElBQUEsZUFBQSxFQUFpQjtBQUpqQixHO0FBUFEsQ0FBVjs7QUFhQSxRQUFBLEdBQVcsdUJBQUssQ0FBQSxPQUFBLEVBQUEsS0FBQSxFQUFMLE9BQUssQ0FBTCxDQUFYO2VBTWUsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZX0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHtmbG93fSBmcm9tIFwicGFuZGEtZ2FyZGVuXCJcbmltcG9ydCB7Zmlyc3QsIGluY2x1ZGUsIGZyb21KU09OLCB0b0pTT04sIGlzU3RyaW5nLCBkYXNoZWQsIHRvTG93ZXIsIG1pY3Jvc2Vjb25kcywgcGxhaW5UZXh0LCBjYW1lbENhc2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IFJlc3BvbnNlcyBmcm9tIFwiLi9yZXNwb25zZXNcIlxuaW1wb3J0IHttZDUsIGhhc2hDaGVjaywgdG9TdHJpbmd9IGZyb20gXCIuL2NhY2hlXCJcbmltcG9ydCB7bWF0Y2hDT1JTfSBmcm9tIFwiLi9jb3JzXCJcbmltcG9ydCB7aXNDb21wcmVzc2libGUsIGd6aXB9IGZyb20gXCIuL2NvbXByZXNzXCJcblxuZXhlY3V0ZSA9IChjb250ZXh0KSAtPlxuICB7aGFuZGxlcnMsIG1hdGNoOntkYXRhOntyZXNvdXJjZX0sIG1ldGhvZH19ID0gY29udGV4dFxuICBjb25zb2xlLmxvZyByZXNvdXJjZSwgbWV0aG9kXG5cbiAgdW5sZXNzIGYgPSBoYW5kbGVyc1tkYXNoZWQgcmVzb3VyY2VdW3RvTG93ZXIgbWV0aG9kXVxuICAgIHRocm93IG5ldyBSZXNwb25zZXMuTm90SW1wbGVtZW50ZWQgXCJubyBoYW5kbGVyIGZvciAje3Jlc291cmNlfSAje21ldGhvZH1cIlxuXG4gIGF3YWl0IGYgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIlxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB0b0pTT04gYm9keSB1bmxlc3MgaXNTdHJpbmcgYm9keVxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gZmFsc2VcbiAgICAgIHdoZW4gXCJnemlwXCJcbiAgICAgICAgYnVmZmVyID0gQnVmZmVyLmZyb20gKHRvU3RyaW5nIGJvZHkpLCBcInV0ZjhcIlxuICAgICAgICBpZiBpc0NvbXByZXNzaWJsZSBidWZmZXIsIGNvbnRleHQubWF0Y2guYWNjZXB0XG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gYXdhaXQgZ3ppcCBidWZmZXJcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnRleHQubWF0Y2guYWNjZXB0RW5jb2RpbmcgPSBcImlkZW50aXR5XCJcbiAgICAgICAgICBjb250ZXh0ID0gbWF0Y2hFbmNvZGluZyBjb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcblxuICBpZiAoY2FjaGUgPSBtYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlKT9cbiAgICB7bWF4QWdlLCBzaGFyZWRNYXhBZ2V9ID0gY2FjaGVcbiAgICBpZiBtYXhBZ2U/ICYmIHNoYXJlZE1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfSwgcy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcbiAgICBlbHNlIGlmIG1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfVwiXG4gICAgZWxzZSBpZiBzaGFyZWRNYXhBZ2U/XG4gICAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwicy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoY29udGV4dCkgLT5cbiAge21hdGNoOntkYXRhOntyZXNvdXJjZX0sIG1ldGhvZH19ID0gY29udGV4dFxuICBjb25zb2xlLmxvZyBcIiN7Y2FtZWxDYXNlIHBsYWluVGV4dCByZXNvdXJjZX0je21ldGhvZH1EaXNwYXRjaFwiOlxuICAgIChtaWNyb3NlY29uZHMoKSAtIGNvbnRleHQuc3RhcnQpIC8gMTAwMFxuXG4gIHtjb2RlLCB0YWcsIGhlYWRlcnMsIGJvZHksIGlzQmFzZTY0RW5jb2RlZD1mYWxzZX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgc3RhdHVzQ29kZTogY29kZVxuICBzdGF0dXNEZXNjcmlwdGlvbjogdGFnXG4gIGhlYWRlcnM6IGhlYWRlcnNcbiAgYm9keTogYm9keVxuICBpc0Jhc2U2NEVuY29kZWQ6IGlzQmFzZTY0RW5jb2RlZFxuXG5kaXNwYXRjaCA9IGZsb3cgW1xuICBleGVjdXRlXG4gIHN0YW1wXG4gIHJlc3BvbmRcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
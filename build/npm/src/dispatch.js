"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _pandaGarden = require("panda-garden");

var _pandaParchment = require("panda-parchment");

var _env = _interopRequireDefault(require("./env"));

var _logger = _interopRequireDefault(require("./logger"));

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

  _logger.default.info(resource, method);

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
  var body, code, headers, isBase64Encoded, tag;

  _logger.default.info(`${resource} ${method} Dispatch`, (((0, _pandaParchment.microseconds)() - context.start) / 1000).toFixed(2));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVJBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7O0FBVUEsT0FBQSxHQUFVLGdCQUFBLE9BQUEsRUFBQTtBQUNSLE1BQUEsQ0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLFFBQUE7QUFBVyxJQUFBLEtBQUEsRUFBTTtBQUFDLE1BQUEsSUFBQSxFQUFLO0FBQU4sUUFBQTtBQUFNLE9BQU47QUFBa0IsTUFBQTtBQUFsQjtBQUFqQixNQUFBLE9BQUE7O0FBQ0Esa0JBQUEsSUFBQSxDQUFBLFFBQUEsRUFBQSxNQUFBOztBQUVBLE1BQUEsRUFBTyxDQUFBLEdBQUksUUFBUyxDQUFBLDRCQUFBLFFBQUEsQ0FBQSxDQUFULENBQTBCLDZCQUFyQyxNQUFxQyxDQUExQixDQUFYLENBQUEsRUFBQTtBQUNFLFVBQU0sSUFBSSxtQkFBSixjQUFBLENBQTZCLGtCQUFBLFFBQUEsSUFBQSxNQURyQyxFQUNRLENBQU47OztBQUVGLFNBQUEsTUFBTSxDQUFBLENBQU4sT0FBTSxDQUFOO0FBUFEsQ0FBVjs7QUFTQSxhQUFBLEdBQWdCLGdCQUFBLE9BQUEsRUFBQTtBQUNkLE1BQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsU0FBQTtBQUFBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBYyxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsQ0FBZCxRQUFBO0FBQ0EsR0FBQTtBQUFBLElBQUEsSUFBQTtBQUFBLElBQUE7QUFBQSxNQUFzQixPQUFPLENBQTdCLFFBQUE7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QU5RLENBQVY7O0FBWUEsUUFBQSxHQUFXLHVCQUFLLENBQUEsT0FBQSxFQUFBLEtBQUEsRUFBTCxPQUFLLENBQUwsQ0FBWDtlQU1lLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Jlc29sdmV9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7Zmxvd30gZnJvbSBcInBhbmRhLWdhcmRlblwiXG5pbXBvcnQge2ZpcnN0LCBpbmNsdWRlLCBmcm9tSlNPTiwgdG9KU09OLCBpc1N0cmluZywgZGFzaGVkLCB0b0xvd2VyLCBtaWNyb3NlY29uZHN9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IGVudiBmcm9tIFwiLi9lbnZcIlxuaW1wb3J0IGxvZyBmcm9tIFwiLi9sb2dnZXJcIlxuaW1wb3J0IFJlc3BvbnNlcyBmcm9tIFwiLi9yZXNwb25zZXNcIlxuaW1wb3J0IHttZDUsIGhhc2hDaGVjaywgdG9TdHJpbmd9IGZyb20gXCIuL2NhY2hlXCJcbmltcG9ydCB7bWF0Y2hDT1JTfSBmcm9tIFwiLi9jb3JzXCJcbmltcG9ydCB7aXNDb21wcmVzc2libGUsIGd6aXB9IGZyb20gXCIuL2NvbXByZXNzXCJcblxuZXhlY3V0ZSA9IChjb250ZXh0KSAtPlxuICB7aGFuZGxlcnMsIG1hdGNoOntkYXRhOntyZXNvdXJjZX0sIG1ldGhvZH19ID0gY29udGV4dFxuICBsb2cuaW5mbyByZXNvdXJjZSwgbWV0aG9kXG5cbiAgdW5sZXNzIGYgPSBoYW5kbGVyc1tkYXNoZWQgcmVzb3VyY2VdW3RvTG93ZXIgbWV0aG9kXVxuICAgIHRocm93IG5ldyBSZXNwb25zZXMuTm90SW1wbGVtZW50ZWQgXCJubyBoYW5kbGVyIGZvciAje3Jlc291cmNlfSAje21ldGhvZH1cIlxuXG4gIGF3YWl0IGYgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIlxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB0b0pTT04gYm9keSB1bmxlc3MgaXNTdHJpbmcgYm9keVxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gZmFsc2VcbiAgICAgIHdoZW4gXCJnemlwXCJcbiAgICAgICAgYnVmZmVyID0gQnVmZmVyLmZyb20gKHRvU3RyaW5nIGJvZHkpLCBcInV0ZjhcIlxuICAgICAgICBpZiBpc0NvbXByZXNzaWJsZSBidWZmZXIsIGNvbnRleHQubWF0Y2guYWNjZXB0XG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gYXdhaXQgZ3ppcCBidWZmZXJcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnRleHQubWF0Y2guYWNjZXB0RW5jb2RpbmcgPSBcImlkZW50aXR5XCJcbiAgICAgICAgICBjb250ZXh0ID0gbWF0Y2hFbmNvZGluZyBjb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcblxuICBpZiAoY2FjaGUgPSBtYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlKT9cbiAgICB7bWF4QWdlLCBzaGFyZWRNYXhBZ2V9ID0gY2FjaGVcbiAgICBpZiBtYXhBZ2U/ICYmIHNoYXJlZE1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfSwgcy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcbiAgICBlbHNlIGlmIG1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfVwiXG4gICAgZWxzZSBpZiBzaGFyZWRNYXhBZ2U/XG4gICAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwicy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoY29udGV4dCkgLT5cbiAgbG9nLmluZm8gXCIje3Jlc291cmNlfSAje21ldGhvZH0gRGlzcGF0Y2hcIixcbiAgICAoKG1pY3Jvc2Vjb25kcygpIC0gY29udGV4dC5zdGFydCkgLyAxMDAwKS50b0ZpeGVkKDIpXG5cbiAge2NvZGUsIHRhZywgaGVhZGVycywgYm9keSwgaXNCYXNlNjRFbmNvZGVkPWZhbHNlfSA9IGNvbnRleHQucmVzcG9uc2VcblxuICBzdGF0dXNDb2RlOiBjb2RlXG4gIHN0YXR1c0Rlc2NyaXB0aW9uOiB0YWdcbiAgaGVhZGVyczogaGVhZGVyc1xuICBib2R5OiBib2R5XG4gIGlzQmFzZTY0RW5jb2RlZDogaXNCYXNlNjRFbmNvZGVkXG5cbmRpc3BhdGNoID0gZmxvdyBbXG4gIGV4ZWN1dGVcbiAgc3RhbXBcbiAgcmVzcG9uZFxuXVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
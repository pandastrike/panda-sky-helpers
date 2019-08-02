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

var _meter = _interopRequireDefault(require("./meter"));

var _responses = _interopRequireDefault(require("./responses"));

var _cache = require("./cache");

var _cors = require("./cors");

var _compress = require("./compress");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatch, execute, matchCache, matchEncoding, matchHeaders, matchStatus, respond, stamp;
execute = (0, _meter.default)("Execute", async function (context) {
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
});

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVRBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7QUFXQSxPQUFBLEdBQVUsb0JBQUEsU0FBQSxFQUFpQixnQkFBQSxPQUFBLEVBQUE7QUFDekIsTUFBQSxDQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQSxRQUFBO0FBQUEsR0FBQTtBQUFBLElBQUEsUUFBQTtBQUFXLElBQUEsS0FBQSxFQUFNO0FBQUMsTUFBQSxJQUFBLEVBQUs7QUFBTixRQUFBO0FBQU0sT0FBTjtBQUFrQixNQUFBO0FBQWxCO0FBQWpCLE1BQUEsT0FBQTs7QUFDQSxrQkFBQSxJQUFBLENBQUEsUUFBQSxFQUFBLE1BQUE7O0FBRUEsTUFBQSxFQUFPLENBQUEsR0FBSSxRQUFTLENBQUEsNEJBQUEsUUFBQSxDQUFBLENBQVQsQ0FBMEIsNkJBQXJDLE1BQXFDLENBQTFCLENBQVgsQ0FBQSxFQUFBO0FBQ0UsVUFBTSxJQUFJLG1CQUFKLGNBQUEsQ0FBNkIsa0JBQUEsUUFBQSxJQUFBLE1BRHJDLEVBQ1EsQ0FBTjs7O0FBRUYsU0FBQSxNQUFNLENBQUEsQ0FBTixPQUFNLENBQU47QUFQUSxDQUFBLENBQVY7O0FBU0EsYUFBQSxHQUFnQixnQkFBQSxPQUFBLEVBQUE7QUFDZCxNQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsV0FBQSxFQUFBLFNBQUE7QUFBQSxHQUFBO0FBQUEsSUFBQTtBQUFBLE1BQWMsT0FBTyxDQUFDLEtBQVIsQ0FBYyxVQUFkLENBQWQsUUFBQTtBQUNBLEdBQUE7QUFBQSxJQUFBLElBQUE7QUFBQSxJQUFB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dCI6WyJpbXBvcnQge3Jlc29sdmV9IGZyb20gXCJwYXRoXCJcbmltcG9ydCB7Zmxvd30gZnJvbSBcInBhbmRhLWdhcmRlblwiXG5pbXBvcnQge2ZpcnN0LCBpbmNsdWRlLCBmcm9tSlNPTiwgdG9KU09OLCBpc1N0cmluZywgZGFzaGVkLCB0b0xvd2VyfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCBlbnYgZnJvbSBcIi4vZW52XCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcbmltcG9ydCBtZXRlciBmcm9tIFwiLi9tZXRlclwiXG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQge21kNSwgaGFzaENoZWNrLCB0b1N0cmluZ30gZnJvbSBcIi4vY2FjaGVcIlxuaW1wb3J0IHttYXRjaENPUlN9IGZyb20gXCIuL2NvcnNcIlxuaW1wb3J0IHtpc0NvbXByZXNzaWJsZSwgZ3ppcH0gZnJvbSBcIi4vY29tcHJlc3NcIlxuXG5leGVjdXRlID0gbWV0ZXIgXCJFeGVjdXRlXCIsIChjb250ZXh0KSAtPlxuICB7aGFuZGxlcnMsIG1hdGNoOntkYXRhOntyZXNvdXJjZX0sIG1ldGhvZH19ID0gY29udGV4dFxuICBsb2dnZXIuaW5mbyByZXNvdXJjZSwgbWV0aG9kXG5cbiAgdW5sZXNzIGYgPSBoYW5kbGVyc1tkYXNoZWQgcmVzb3VyY2VdW3RvTG93ZXIgbWV0aG9kXVxuICAgIHRocm93IG5ldyBSZXNwb25zZXMuTm90SW1wbGVtZW50ZWQgXCJubyBoYW5kbGVyIGZvciAje3Jlc291cmNlfSAje21ldGhvZH1cIlxuXG4gIGF3YWl0IGYgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIlxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB0b0pTT04gYm9keSB1bmxlc3MgaXNTdHJpbmcgYm9keVxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gZmFsc2VcbiAgICAgIHdoZW4gXCJnemlwXCJcbiAgICAgICAgYnVmZmVyID0gQnVmZmVyLmZyb20gKHRvU3RyaW5nIGJvZHkpLCBcInV0ZjhcIlxuICAgICAgICBpZiBpc0NvbXByZXNzaWJsZSBidWZmZXIsIGNvbnRleHQubWF0Y2guYWNjZXB0XG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gYXdhaXQgZ3ppcCBidWZmZXJcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnRleHQubWF0Y2guYWNjZXB0RW5jb2RpbmcgPSBcImlkZW50aXR5XCJcbiAgICAgICAgICBjb250ZXh0ID0gbWF0Y2hFbmNvZGluZyBjb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcblxuICBpZiAoY2FjaGUgPSBtYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlKT9cbiAgICB7bWF4QWdlLCBzaGFyZWRNYXhBZ2V9ID0gY2FjaGVcbiAgICBpZiBtYXhBZ2U/ICYmIHNoYXJlZE1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfSwgcy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcbiAgICBlbHNlIGlmIG1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfVwiXG4gICAgZWxzZSBpZiBzaGFyZWRNYXhBZ2U/XG4gICAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwicy1tYXhhZ2U9I3tzaGFyZWRNYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoY29udGV4dCkgLT5cbiAge2NvZGUsIHRhZywgaGVhZGVycywgYm9keSwgaXNCYXNlNjRFbmNvZGVkPWZhbHNlfSA9IGNvbnRleHQucmVzcG9uc2VcblxuICBzdGF0dXNDb2RlOiBjb2RlXG4gIHN0YXR1c0Rlc2NyaXB0aW9uOiB0YWdcbiAgaGVhZGVyczogaGVhZGVyc1xuICBib2R5OiBib2R5XG4gIGlzQmFzZTY0RW5jb2RlZDogaXNCYXNlNjRFbmNvZGVkXG5cbmRpc3BhdGNoID0gZmxvdyBbXG4gIGV4ZWN1dGVcbiAgc3RhbXBcbiAgcmVzcG9uZFxuXVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
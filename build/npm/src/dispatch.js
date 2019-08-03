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
  var body, code, headers, isBase64Encoded, method, resource, tag;
  ({
    match: {
      data: {
        resource
      },
      method
    }
  } = context);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVJBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUE7O0FBVUEsT0FBQSxHQUFVLGdCQUFBLE9BQUEsRUFBQTtBQUNSLE1BQUEsQ0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLFFBQUE7QUFBVyxJQUFBLEtBQUEsRUFBTTtBQUFDLE1BQUEsSUFBQSxFQUFLO0FBQU4sUUFBQTtBQUFNLE9BQU47QUFBa0IsTUFBQTtBQUFsQjtBQUFqQixNQUFBLE9BQUE7O0FBQ0Esa0JBQUEsSUFBQSxDQUFBLFFBQUEsRUFBQSxNQUFBOztBQUVBLE1BQUEsRUFBTyxDQUFBLEdBQUksUUFBUyxDQUFBLDRCQUFBLFFBQUEsQ0FBQSxDQUFULENBQTBCLDZCQUFyQyxNQUFxQyxDQUExQixDQUFYLENBQUEsRUFBQTtBQUNFLFVBQU0sSUFBSSxtQkFBSixjQUFBLENBQTZCLGtCQUFBLFFBQUEsSUFBQSxNQURyQyxFQUNRLENBQU47OztBQUVGLFNBQUEsTUFBTSxDQUFBLENBQU4sT0FBTSxDQUFOO0FBUFEsQ0FBVjs7QUFTQSxhQUFBLEdBQWdCLGdCQUFBLE9BQUEsRUFBQTtBQUNkLE1BQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsU0FBQTtBQUFBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBYyxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsQ0FBZCxRQUFBO0FBQ0EsR0FBQTtBQUFBLElBQUEsSUFBQTtBQUFBLElBQUE7QUFBQSxNQUFzQixPQUFPLENBQTdCLFFBQUE7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LFVBQUEsRUFBQSxJQUFBO0FBQ0EsSUFBQSxpQkFBQSxFQURBLEdBQUE7QUFFQSxJQUFBLE9BQUEsRUFGQSxPQUFBO0FBR0EsSUFBQSxJQUFBLEVBSEEsSUFBQTtBQUlBLElBQUEsZUFBQSxFQUFpQjtBQUpqQixHO0FBUFEsQ0FBVjs7QUFhQSxRQUFBLEdBQVcsdUJBQUssQ0FBQSxPQUFBLEVBQUEsS0FBQSxFQUFMLE9BQUssQ0FBTCxDQUFYO2VBTWUsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZX0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHtmbG93fSBmcm9tIFwicGFuZGEtZ2FyZGVuXCJcbmltcG9ydCB7Zmlyc3QsIGluY2x1ZGUsIGZyb21KU09OLCB0b0pTT04sIGlzU3RyaW5nLCBkYXNoZWQsIHRvTG93ZXIsIG1pY3Jvc2Vjb25kc30gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQgZW52IGZyb20gXCIuL2VudlwiXG5pbXBvcnQgbG9nIGZyb20gXCIuL2xvZ2dlclwiXG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQge21kNSwgaGFzaENoZWNrLCB0b1N0cmluZ30gZnJvbSBcIi4vY2FjaGVcIlxuaW1wb3J0IHttYXRjaENPUlN9IGZyb20gXCIuL2NvcnNcIlxuaW1wb3J0IHtpc0NvbXByZXNzaWJsZSwgZ3ppcH0gZnJvbSBcIi4vY29tcHJlc3NcIlxuXG5leGVjdXRlID0gKGNvbnRleHQpIC0+XG4gIHtoYW5kbGVycywgbWF0Y2g6e2RhdGE6e3Jlc291cmNlfSwgbWV0aG9kfX0gPSBjb250ZXh0XG4gIGxvZy5pbmZvIHJlc291cmNlLCBtZXRob2RcblxuICB1bmxlc3MgZiA9IGhhbmRsZXJzW2Rhc2hlZCByZXNvdXJjZV1bdG9Mb3dlciBtZXRob2RdXG4gICAgdGhyb3cgbmV3IFJlc3BvbnNlcy5Ob3RJbXBsZW1lbnRlZCBcIm5vIGhhbmRsZXIgZm9yICN7cmVzb3VyY2V9ICN7bWV0aG9kfVwiXG5cbiAgYXdhaXQgZiBjb250ZXh0XG5cbm1hdGNoRW5jb2RpbmcgPSAoY29udGV4dCkgLT5cbiAge21lZGlhdHlwZX0gPSBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2VcbiAge2JvZHksIGVuY29kZVJlYWR5fSA9IGNvbnRleHQucmVzcG9uc2VcblxuICBpZiBtZWRpYXR5cGUgJiYgYm9keT8gJiYgIWVuY29kZVJlYWR5XG4gICAgc3dpdGNoIGNvbnRleHQubWF0Y2guYWNjZXB0RW5jb2RpbmdcbiAgICAgIHdoZW4gXCJpZGVudGl0eVwiXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IHRvSlNPTiBib2R5IHVubGVzcyBpc1N0cmluZyBib2R5XG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaGVhZGVyc1tcIkNvbnRlbnQtRW5jb2RpbmdcIl0gPSBcImlkZW50aXR5XCJcbiAgICAgICAgY29udGV4dC5yZXNwb25zZS5pc0Jhc2U2NEVuY29kZWQgPSBmYWxzZVxuICAgICAgd2hlbiBcImd6aXBcIlxuICAgICAgICBidWZmZXIgPSBCdWZmZXIuZnJvbSAodG9TdHJpbmcgYm9keSksIFwidXRmOFwiXG4gICAgICAgIGlmIGlzQ29tcHJlc3NpYmxlIGJ1ZmZlciwgY29udGV4dC5tYXRjaC5hY2NlcHRcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSBhd2FpdCBnemlwIGJ1ZmZlclxuICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29udGV4dC5tYXRjaC5hY2NlcHRFbmNvZGluZyA9IFwiaWRlbnRpdHlcIlxuICAgICAgICAgIGNvbnRleHQgPSBtYXRjaEVuY29kaW5nIGNvbnRleHRcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQmFkIGVuY29kaW5nOiAje2NvbnRleHQubWF0Y2guYWNjZXB0RW5jb2Rpbmd9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoQ2FjaGUgPSAoY29udGV4dCkgLT5cbiAge3Jlc3BvbnNlOntib2R5fSwgbWF0Y2h9ID0gY29udGV4dFxuXG4gIGlmIGN1cnJlbnQgPSBoYXNoQ2hlY2sgbWF0Y2gsIGJvZHlcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycywgRVRhZzogY3VycmVudFxuXG4gIGlmIChjYWNoZSA9IG1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2UuY2FjaGUpP1xuICAgIHttYXhBZ2UsIHNoYXJlZE1heEFnZX0gPSBjYWNoZVxuICAgIGlmIG1heEFnZT8gJiYgc2hhcmVkTWF4QWdlP1xuICAgICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm1heC1hZ2U9I3ttYXhBZ2V9LCBzLW1heGFnZT0je3NoYXJlZE1heEFnZX1cIlxuICAgIGVsc2UgaWYgbWF4QWdlP1xuICAgICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm1heC1hZ2U9I3ttYXhBZ2V9XCJcbiAgICBlbHNlIGlmIHNoYXJlZE1heEFnZT9cbiAgICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJzLW1heGFnZT0je3NoYXJlZE1heEFnZX1cIlxuXG4gIGNvbnRleHRcblxubWF0Y2hTdGF0dXMgPSAoY29udGV4dCkgLT5cbiAgY29kZSA9IGZpcnN0IGNvbnRleHQubWF0Y2guc2lnbmF0dXJlcy5yZXNwb25zZS5zdGF0dXNcbiAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLCB7Y29kZX0sIHRhZzogUmVzcG9uc2VzW2NvZGVdXG4gIGNvbnRleHRcblxubWF0Y2hIZWFkZXJzID0gKGNvbnRleHQpIC0+XG4gIHthY2NlcHQsIGFjY2VwdEVuY29kaW5nLCBzaWduYXR1cmVzfSA9IGNvbnRleHQubWF0Y2hcblxuICBpZiBzaWduYXR1cmVzLnJlc3BvbnNlLm1lZGlhdHlwZVxuICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogYWNjZXB0XG4gICAgICBcIkNvbnRlbnQtRW5jb2RpbmdcIjogYWNjZXB0RW5jb2RpbmdcbiAgICAgIFZhcnk6IFwiQWNjZXB0LCBBY2NlcHQtRW5jb2RpbmdcIlxuXG4gIGNvbnRleHRcblxuXG5cblxuc3RhbXAgPSBmbG93IFtcbiAgbWF0Y2hFbmNvZGluZ1xuICBtYXRjaENhY2hlXG4gIG1hdGNoU3RhdHVzXG4gIG1hdGNoQ09SU1xuICBtYXRjaEhlYWRlcnNcbl1cblxucmVzcG9uZCA9IChjb250ZXh0KSAtPlxuICB7bWF0Y2g6e2RhdGE6e3Jlc291cmNlfSwgbWV0aG9kfX0gPSBjb250ZXh0XG4gIGxvZy5pbmZvIFwiI3tyZXNvdXJjZX0gI3ttZXRob2R9IERpc3BhdGNoXCIsXG4gICAgKChtaWNyb3NlY29uZHMoKSAtIGNvbnRleHQuc3RhcnQpIC8gMTAwMCkudG9GaXhlZCgyKVxuXG4gIHtjb2RlLCB0YWcsIGhlYWRlcnMsIGJvZHksIGlzQmFzZTY0RW5jb2RlZD1mYWxzZX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgc3RhdHVzQ29kZTogY29kZVxuICBzdGF0dXNEZXNjcmlwdGlvbjogdGFnXG4gIGhlYWRlcnM6IGhlYWRlcnNcbiAgYm9keTogYm9keVxuICBpc0Jhc2U2NEVuY29kZWQ6IGlzQmFzZTY0RW5jb2RlZFxuXG5kaXNwYXRjaCA9IGZsb3cgW1xuICBleGVjdXRlXG4gIHN0YW1wXG4gIHJlc3BvbmRcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
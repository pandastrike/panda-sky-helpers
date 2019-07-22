"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _sundog = _interopRequireDefault(require("sundog"));

var _pandaGarden = require("panda-garden");

var _pandaParchment = require("panda-parchment");

var _env = _interopRequireDefault(require("./env"));

var _logger = _interopRequireDefault(require("./logger"));

var _responses = _interopRequireDefault(require("./responses"));

var _cache = require("./cache");

var _cors = require("./cors");

var _compress = require("./compress");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatch, execute, invoke, matchCache, matchEncoding, matchHeaders, matchStatus, respond, stamp;
({
  invoke
} = (0, _sundog.default)(_awsSdk.default).AWS.Lambda());

execute = async function (context) {
  var Payload, name, partition;
  ({
    partition
  } = context.match);
  name = `${_env.default.name}-${_env.default.environment}-${partition}`;

  _logger.default.debug(`Dispatching to lambda '${name}'`);

  ({
    Payload
  } = await invoke(name, context));
  context.response = (0, _pandaParchment.fromJSON)(Payload.toString()).response;
  return context;
};

matchCache = function (context) {
  var cache, etag, match, maxAge, response;
  ({
    response,
    match
  } = context);

  if (({
    cache
  } = match.signatures.response) != null) {
    ({
      maxAge,
      etag
    } = cache);
    (0, _pandaParchment.include)(context.response.headers, {
      "Cache-Control": maxAge ? `max-age=${maxAge}` : void 0,
      ETag: etag ? (0, _cache.md5)(response.body) : void 0
    });
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

matchEncoding = async function (context) {
  var body, buffer, encodeReady, mediatype;
  ({
    mediatype
  } = context.match.signatures.response);
  ({
    body,
    encodeReady
  } = context.response);

  if (mediatype && !encodeReady) {
    switch (context.match.acceptEncoding) {
      case "identity":
        break;

      case "gzip":
        buffer = Buffer.from((0, _pandaParchment.toJSON)(body), "utf8");

        if ((0, _compress.isCompressible)(buffer, context.match.accept)) {
          context.response.body = await (0, _compress.gzip)(buffer);
          context.response.isBase64Encoded = true;
        } else {
          context.response.headers["Content-Encoding"] = "identity";
        }

        break;

      default:
        throw new Error(`Bad encoding: ${context.match.acceptEncoding}`);
    }
  }

  return context;
};

stamp = (0, _pandaGarden.flow)([matchCache, matchStatus, _cors.matchCORS, matchHeaders, matchEncoding]);

respond = function ({
  response
}) {
  var body, code, headers, isBase64Encoded, tag;
  ({
    code,
    tag,
    headers,
    body,
    isBase64Encoded = false
  } = response);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVRBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO0FBV0EsQ0FBQTtBQUFBLEVBQUE7QUFBQSxJQUFXLHFCQUFBLGVBQUEsRUFBWSxHQUFaLENBQVgsTUFBVyxFQUFYOztBQUVBLE9BQUEsR0FBVSxnQkFBQSxPQUFBLEVBQUE7QUFDUixNQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQTtBQUFBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBYyxPQUFPLENBQXJCLEtBQUE7QUFFQSxFQUFBLElBQUEsR0FBTyxHQUFHLGFBQUgsSUFBQSxJQUFlLGFBQWYsV0FBQSxJQUFBLFNBQUEsRUFBUDs7QUFDQSxrQkFBQSxLQUFBLENBQWEsMEJBQUEsSUFBYixHQUFBOztBQUNBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBWSxNQUFNLE1BQUEsQ0FBQSxJQUFBLEVBQWxCLE9BQWtCLENBQWxCO0FBQ0EsRUFBQSxPQUFPLENBQVAsUUFBQSxHQUFvQiw4QkFBUyxPQUFPLENBQWpCLFFBQVUsRUFBVCxDQUFELENBQThCLFFBQWpEO1NBQ0EsTztBQVBRLENBQVY7O0FBU0EsVUFBQSxHQUFhLFVBQUEsT0FBQSxFQUFBO0FBQ1gsTUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLFFBQUE7QUFBQSxJQUFBO0FBQUEsTUFBQSxPQUFBOztBQUVBLE1BQUcsQ0FBQTtBQUFBLElBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBQSxVQUFB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SUFBQSxJQUFBO0FBQTJCLElBQUEsZUFBQSxHQUEzQjtBQUFBLE1BQUEsUUFBQTtTQUVBO0FBQUEsSUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLElBQUEsaUJBQUEsRUFEQSxHQUFBO0FBRUEsSUFBQSxPQUFBLEVBRkEsT0FBQTtBQUdBLElBQUEsSUFBQSxFQUhBLElBQUE7QUFJQSxJQUFBLGVBQUEsRUFBaUI7QUFKakIsRztBQUhRLENBQVY7O0FBU0EsUUFBQSxHQUFXLHVCQUFLLENBQUEsT0FBQSxFQUFBLEtBQUEsRUFBTCxPQUFLLENBQUwsQ0FBWDtlQU1lLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU0RLIGZyb20gXCJhd3Mtc2RrXCJcbmltcG9ydCBTdW5kb2cgZnJvbSBcInN1bmRvZ1wiXG5pbXBvcnQge2Zsb3d9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtmaXJzdCwgaW5jbHVkZSwgZnJvbUpTT04sIHRvSlNPTiwgaXNTdHJpbmd9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IGVudiBmcm9tIFwiLi9lbnZcIlxuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIlxuaW1wb3J0IFJlc3BvbnNlcyBmcm9tIFwiLi9yZXNwb25zZXNcIlxuaW1wb3J0IHttZDV9IGZyb20gXCIuL2NhY2hlXCJcbmltcG9ydCB7bWF0Y2hDT1JTfSBmcm9tIFwiLi9jb3JzXCJcbmltcG9ydCB7aXNDb21wcmVzc2libGUsIGd6aXB9IGZyb20gXCIuL2NvbXByZXNzXCJcblxue2ludm9rZX0gPSBTdW5kb2coU0RLKS5BV1MuTGFtYmRhKClcblxuZXhlY3V0ZSA9IChjb250ZXh0KSAtPlxuICB7cGFydGl0aW9ufSA9IGNvbnRleHQubWF0Y2hcblxuICBuYW1lID0gXCIje2Vudi5uYW1lfS0je2Vudi5lbnZpcm9ubWVudH0tI3twYXJ0aXRpb259XCJcbiAgbG9nZ2VyLmRlYnVnIFwiRGlzcGF0Y2hpbmcgdG8gbGFtYmRhICcje25hbWV9J1wiXG4gIHtQYXlsb2FkfSA9IGF3YWl0IGludm9rZSBuYW1lLCBjb250ZXh0XG4gIGNvbnRleHQucmVzcG9uc2UgPSAoZnJvbUpTT04gUGF5bG9hZC50b1N0cmluZygpKS5yZXNwb25zZVxuICBjb250ZXh0XG5cbm1hdGNoQ2FjaGUgPSAoY29udGV4dCkgLT5cbiAge3Jlc3BvbnNlLCBtYXRjaH0gPSBjb250ZXh0XG5cbiAgaWYgKHtjYWNoZX0gPSBtYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlKT9cbiAgICB7bWF4QWdlLCBldGFnfSA9IGNhY2hlXG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfVwiIGlmIG1heEFnZVxuICAgICAgRVRhZzogbWQ1IHJlc3BvbnNlLmJvZHkgaWYgZXRhZ1xuXG4gIGNvbnRleHRcblxubWF0Y2hTdGF0dXMgPSAoY29udGV4dCkgLT5cbiAgY29kZSA9IGZpcnN0IGNvbnRleHQubWF0Y2guc2lnbmF0dXJlcy5yZXNwb25zZS5zdGF0dXNcbiAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLCB7Y29kZX0sIHRhZzogUmVzcG9uc2VzW2NvZGVdXG4gIGNvbnRleHRcblxubWF0Y2hIZWFkZXJzID0gKGNvbnRleHQpIC0+XG4gIHthY2NlcHQsIGFjY2VwdEVuY29kaW5nLCBzaWduYXR1cmVzfSA9IGNvbnRleHQubWF0Y2hcblxuICBpZiBzaWduYXR1cmVzLnJlc3BvbnNlLm1lZGlhdHlwZVxuICAgIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogYWNjZXB0XG4gICAgICBcIkNvbnRlbnQtRW5jb2RpbmdcIjogYWNjZXB0RW5jb2RpbmdcbiAgICAgIFZhcnk6IFwiQWNjZXB0LCBBY2NlcHQtRW5jb2RpbmdcIlxuXG4gIGNvbnRleHRcblxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIiB0aGVuIGJyZWFrXG4gICAgICB3aGVuIFwiZ3ppcFwiXG4gICAgICAgIGJ1ZmZlciA9IEJ1ZmZlci5mcm9tICh0b0pTT04gYm9keSksIFwidXRmOFwiXG4gICAgICAgIGlmIGlzQ29tcHJlc3NpYmxlIGJ1ZmZlciwgY29udGV4dC5tYXRjaC5hY2NlcHRcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSBhd2FpdCBnemlwIGJ1ZmZlclxuICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5oZWFkZXJzW1wiQ29udGVudC1FbmNvZGluZ1wiXSA9IFwiaWRlbnRpdHlcIlxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJCYWQgZW5jb2Rpbmc6ICN7Y29udGV4dC5tYXRjaC5hY2NlcHRFbmNvZGluZ31cIlxuXG4gIGNvbnRleHRcblxuc3RhbXAgPSBmbG93IFtcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG4gIG1hdGNoRW5jb2Rpbmdcbl1cblxucmVzcG9uZCA9ICh7cmVzcG9uc2V9KSAtPlxuICB7Y29kZSwgdGFnLCBoZWFkZXJzLCBib2R5LCBpc0Jhc2U2NEVuY29kZWQ9ZmFsc2V9ID0gcmVzcG9uc2VcblxuICBzdGF0dXNDb2RlOiBjb2RlXG4gIHN0YXR1c0Rlc2NyaXB0aW9uOiB0YWdcbiAgaGVhZGVyczogaGVhZGVyc1xuICBib2R5OiBib2R5XG4gIGlzQmFzZTY0RW5jb2RlZDogaXNCYXNlNjRFbmNvZGVkXG5cbmRpc3BhdGNoID0gZmxvdyBbXG4gIGV4ZWN1dGVcbiAgc3RhbXBcbiAgcmVzcG9uZFxuXVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
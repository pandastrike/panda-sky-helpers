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

var _cache = require("./cache");

var _cors = require("./cors");

var _compress = require("./compress");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatch, execute, invoke, matchCache, matchEncoding, matchHeaders, matchStatus, respond, stamp;
({
  invoke
} = (0, _sundog.default)(_awsSdk.default).AWS.Lambda());

execute = async function (context) {
  var name, partition;
  ({
    partition
  } = context.match);
  name = `${_env.default.name}-${_env.default.environment}-${partition}`;

  _logger.default.debug(`Dispatching to lambda '${name}'`);

  return await invoke(name, context);
};

matchCache = function (context) {
  var etag, match, maxAge, response;
  ({
    response,
    match
  } = context);
  ({
    maxAge,
    etag
  } = match.signatures.response.cache);
  (0, _pandaParchment.include)(context.response.headers({
    "Cache-Control": maxAge ? `max-age=${maxAge}` : void 0,
    ETag: etag ? (0, _cache.md5)(response.body) : void 0
  }));
  return context;
};

matchStatus = function (context) {
  var code;
  code = (0, _pandaParchment.first)(context.match.signatures.response.status);
  (0, _pandaParchment.include)(context.response, {
    code
  }, {
    tag: Response(code)
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
  var body, buffer, encodeReady;
  ({
    body,
    encodeReady
  } = context.response);

  if (body != null && !encodeReady) {
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
  response,
  callback
}) {
  var body, code, headers, isBase64Encoded, tag;
  ({
    code,
    tag,
    headers,
    body,
    isBase64Encoded = false
  } = response);
  return callback(null, {
    statusCode: code,
    statusDescription: tag,
    headers: headers,
    body: body,
    isBase64Encoded: isBase64Encoded
  });
};

dispatch = (0, _pandaGarden.flow)([execute, stamp, respond]);
var _default = dispatch;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVJBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO0FBVUEsQ0FBQTtBQUFBLEVBQUE7QUFBQSxJQUFXLHFCQUFBLGVBQUEsRUFBWSxHQUFaLENBQVgsTUFBVyxFQUFYOztBQUVBLE9BQUEsR0FBVSxnQkFBQSxPQUFBLEVBQUE7QUFDUixNQUFBLElBQUEsRUFBQSxTQUFBO0FBQUEsR0FBQTtBQUFBLElBQUE7QUFBQSxNQUFjLE9BQU8sQ0FBckIsS0FBQTtBQUVBLEVBQUEsSUFBQSxHQUFPLEdBQUcsYUFBSCxJQUFBLElBQWUsYUFBZixXQUFBLElBQUEsU0FBQSxFQUFQOztBQUNBLGtCQUFBLEtBQUEsQ0FBYSwwQkFBQSxJQUFiLEdBQUE7O0FBQ0EsU0FBQSxNQUFNLE1BQUEsQ0FBQSxJQUFBLEVBQU4sT0FBTSxDQUFOO0FBTFEsQ0FBVjs7QUFPQSxVQUFBLEdBQWEsVUFBQSxPQUFBLEVBQUE7QUFDWCxNQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLFFBQUE7QUFBQSxHQUFBO0FBQUEsSUFBQSxRQUFBO0FBQUEsSUFBQTtBQUFBLE1BQUEsT0FBQTtBQUNBLEdBQUE7QUFBQSxJQUFBLE1BQUE7QUFBQSxJQUFBO0FBQUEsTUFBaUIsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsUUFBakIsQ0FBakIsS0FBQTtBQUVBLCtCQUFRLE9BQU8sQ0FBQyxRQUFSLENBQUEsT0FBQSxDQUNOO0FBQUEscUJBQXdDLE1BQXZCLEdBQUEsV0FBQSxNQUFBLEVBQUEsR0FBQSxLQUFqQixDQUFBO0FB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O0FBU0EsUUFBQSxHQUFXLHVCQUFLLENBQUEsT0FBQSxFQUFBLEtBQUEsRUFBTCxPQUFLLENBQUwsQ0FBWDtlQU1lLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU0RLIGZyb20gXCJhd3Mtc2RrXCJcbmltcG9ydCBTdW5kb2cgZnJvbSBcInN1bmRvZ1wiXG5pbXBvcnQge2Zsb3d9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtmaXJzdCwgaW5jbHVkZSwgdG9KU09OLCBpc1N0cmluZ30gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQgZW52IGZyb20gXCIuL2VudlwiXG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5pbXBvcnQge21kNX0gZnJvbSBcIi4vY2FjaGVcIlxuaW1wb3J0IHttYXRjaENPUlN9IGZyb20gXCIuL2NvcnNcIlxuaW1wb3J0IHtpc0NvbXByZXNzaWJsZSwgZ3ppcH0gZnJvbSBcIi4vY29tcHJlc3NcIlxuXG57aW52b2tlfSA9IFN1bmRvZyhTREspLkFXUy5MYW1iZGEoKVxuXG5leGVjdXRlID0gKGNvbnRleHQpIC0+XG4gIHtwYXJ0aXRpb259ID0gY29udGV4dC5tYXRjaFxuXG4gIG5hbWUgPSBcIiN7ZW52Lm5hbWV9LSN7ZW52LmVudmlyb25tZW50fS0je3BhcnRpdGlvbn1cIlxuICBsb2dnZXIuZGVidWcgXCJEaXNwYXRjaGluZyB0byBsYW1iZGEgJyN7bmFtZX0nXCJcbiAgYXdhaXQgaW52b2tlIG5hbWUsIGNvbnRleHRcblxubWF0Y2hDYWNoZSA9IChjb250ZXh0KSAtPlxuICB7cmVzcG9uc2UsIG1hdGNofSA9IGNvbnRleHRcbiAge21heEFnZSwgZXRhZ30gPSBtYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlLmNhY2hlXG5cbiAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNcbiAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJtYXgtYWdlPSN7bWF4QWdlfVwiIGlmIG1heEFnZVxuICAgIEVUYWc6IG1kNSByZXNwb25zZS5ib2R5IGlmIGV0YWdcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlIGNvZGVcbiAgY29udGV4dFxuXG5tYXRjaEhlYWRlcnMgPSAoY29udGV4dCkgLT5cbiAge2FjY2VwdCwgYWNjZXB0RW5jb2RpbmcsIHNpZ25hdHVyZXN9ID0gY29udGV4dC5tYXRjaFxuXG4gIGlmIHNpZ25hdHVyZXMucmVzcG9uc2UubWVkaWF0eXBlXG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBhY2NlcHRcbiAgICAgIFwiQ29udGVudC1FbmNvZGluZ1wiOiBhY2NlcHRFbmNvZGluZ1xuICAgICAgVmFyeTogXCJBY2NlcHQsIEFjY2VwdC1FbmNvZGluZ1wiXG5cbiAgY29udGV4dFxuXG5cbm1hdGNoRW5jb2RpbmcgPSAoY29udGV4dCkgLT5cbiAge2JvZHksIGVuY29kZVJlYWR5fSA9IGNvbnRleHQucmVzcG9uc2VcblxuICBpZiBib2R5PyAmJiAhZW5jb2RlUmVhZHlcbiAgICBzd2l0Y2ggY29udGV4dC5tYXRjaC5hY2NlcHRFbmNvZGluZ1xuICAgICAgd2hlbiBcImlkZW50aXR5XCIgdGhlbiBicmVha1xuICAgICAgd2hlbiBcImd6aXBcIlxuICAgICAgICBidWZmZXIgPSBCdWZmZXIuZnJvbSAodG9KU09OIGJvZHkpLCBcInV0ZjhcIlxuICAgICAgICBpZiBpc0NvbXByZXNzaWJsZSBidWZmZXIsIGNvbnRleHQubWF0Y2guYWNjZXB0XG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gYXdhaXQgZ3ppcCBidWZmZXJcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuaGVhZGVyc1tcIkNvbnRlbnQtRW5jb2RpbmdcIl0gPSBcImlkZW50aXR5XCJcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiQmFkIGVuY29kaW5nOiAje2NvbnRleHQubWF0Y2guYWNjZXB0RW5jb2Rpbmd9XCJcblxuICBjb250ZXh0XG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoQ2FjaGVcbiAgbWF0Y2hTdGF0dXNcbiAgbWF0Y2hDT1JTXG4gIG1hdGNoSGVhZGVyc1xuICBtYXRjaEVuY29kaW5nXG5dXG5cbnJlc3BvbmQgPSAoe3Jlc3BvbnNlLCBjYWxsYmFja30pIC0+XG4gIHtjb2RlLCB0YWcsIGhlYWRlcnMsIGJvZHksIGlzQmFzZTY0RW5jb2RlZD1mYWxzZX0gPSByZXNwb25zZVxuICBjYWxsYmFjayBudWxsLFxuICAgIHN0YXR1c0NvZGU6IGNvZGVcbiAgICBzdGF0dXNEZXNjcmlwdGlvbjogdGFnXG4gICAgaGVhZGVyczogaGVhZGVyc1xuICAgIGJvZHk6IGJvZHlcbiAgICBpc0Jhc2U2NEVuY29kZWQ6IGlzQmFzZTY0RW5jb2RlZFxuXG5kaXNwYXRjaCA9IGZsb3cgW1xuICBleGVjdXRlXG4gIHN0YW1wXG4gIHJlc3BvbmRcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
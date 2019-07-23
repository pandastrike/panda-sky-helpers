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
  var Payload, handlerError, name, partition, response, start;
  ({
    partition
  } = context.match);
  name = `${_env.default.name}-${_env.default.environment}-${partition}`;

  _logger.default.debug(`Dispatching to lambda '${name}'`);

  start = (0, _pandaParchment.microseconds)();
  ({
    Payload
  } = await invoke(name, context));

  _logger.default.info(`Dispatch Handler Duration: ${(((0, _pandaParchment.microseconds)() - start) / 1000).toFixed(2)}ms`);

  ({
    response,
    handlerError
  } = (0, _pandaParchment.fromJSON)(Payload.toString()));

  if (handlerError) {
    throw _responses.default.hydrate(handlerError);
  } else {
    context.response = response;
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

  if (mediatype && body != null && !encodeReady) {
    switch (context.match.acceptEncoding) {
      case "identity":
        break;

      case "gzip":
        buffer = Buffer.from((0, _cache.toString)(body), "utf8");

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

matchCache = function (context) {
  var body, current, match, maxAge, ref;
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

  if (maxAge = (ref = match.signatures.response.cache) != null ? ref.maxAge : void 0) {
    (0, _pandaParchment.include)(context.response.headers, {
      "Cache-Control": `max-age=${maxAge}`
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

stamp = (0, _pandaGarden.flow)([matchEncoding, matchCache, matchStatus, _cors.matchCORS, matchHeaders]);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVRBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO0FBV0EsQ0FBQTtBQUFBLEVBQUE7QUFBQSxJQUFXLHFCQUFBLGVBQUEsRUFBWSxHQUFaLENBQVgsTUFBVyxFQUFYOztBQUVBLE9BQUEsR0FBVSxnQkFBQSxPQUFBLEVBQUE7QUFDUixNQUFBLE9BQUEsRUFBQSxZQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQTtBQUFBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBYyxPQUFPLENBQXJCLEtBQUE7QUFFQSxFQUFBLElBQUEsR0FBTyxHQUFHLGFBQUgsSUFBQSxJQUFlLGFBQWYsV0FBQSxJQUFBLFNBQUEsRUFBUDs7QUFDQSxrQkFBQSxLQUFBLENBQWEsMEJBQUEsSUFBYixHQUFBOztBQUVBLEVBQUEsS0FBQSxHQUFRLG1DQUFSO0FBQ0EsR0FBQTtBQUFBLElBQUE7QUFBQSxNQUFZLE1BQU0sTUFBQSxDQUFBLElBQUEsRUFBbEIsT0FBa0IsQ0FBbEI7O0FBQ0Esa0JBQUEsSUFBQSxDQUFZLDhCQUE4QixDQUFDLENBQUMsc0NBQUQsS0FBQSxJQUFELElBQUEsRUFBQSxPQUFBLENBQTlCLENBQThCLENBQTFDLElBQUE7O0FBRUEsR0FBQTtBQUFBLElBQUEsUUFBQTtBQUFBLElBQUE7QUFBQSxNQUEyQiw4QkFBUyxPQUFPLENBQTNDLFFBQW9DLEVBQVQsQ0FBM0I7O0FBQ0EsTUFBQSxZQUFBLEVBQUE7QUFDRSxVQUFNLG1CQUFBLE9BQUEsQ0FEUixZ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QVIsQ0FBUixPQUFBLEVBQ0U7QUFBQSxzQkFBQSxNQUFBO0FBQ0EsMEJBREEsY0FBQTtBQUVBLE1BQUEsSUFBQSxFQUFNO0FBRk4sS0FERjs7O1NBS0YsTztBQVRhLENBQWY7O0FBY0EsS0FBQSxHQUFRLHVCQUFLLENBQUEsYUFBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsZUFBQSxFQUFMLFlBQUssQ0FBTCxDQUFSOztBQVFBLE9BQUEsR0FBVSxVQUFDO0FBQUQsRUFBQTtBQUFDLENBQUQsRUFBQTtBQUNSLE1BQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsZUFBQSxFQUFBLEdBQUE7QUFBQSxHQUFBO0FBQUEsSUFBQSxJQUFBO0FBQUEsSUFBQSxHQUFBO0FBQUEsSUFBQSxPQUFBO0FBQUEsSUFBQSxJQUFBO0FBQTJCLElBQUEsZUFBQSxHQUEzQjtBQUFBLE1BQUEsUUFBQTtTQUVBO0FBQUEsSUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLElBQUEsaUJBQUEsRUFEQSxHQUFBO0FBRUEsSUFBQSxPQUFBLEVBRkEsT0FBQTtBQUdBLElBQUEsSUFBQSxFQUhBLElBQUE7QUFJQSxJQUFBLGVBQUEsRUFBaUI7QUFKakIsRztBQUhRLENBQVY7O0FBU0EsUUFBQSxHQUFXLHVCQUFLLENBQUEsT0FBQSxFQUFBLEtBQUEsRUFBTCxPQUFLLENBQUwsQ0FBWDtlQU1lLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU0RLIGZyb20gXCJhd3Mtc2RrXCJcbmltcG9ydCBTdW5kb2cgZnJvbSBcInN1bmRvZ1wiXG5pbXBvcnQge2Zsb3d9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtmaXJzdCwgaW5jbHVkZSwgZnJvbUpTT04sIHRvSlNPTiwgaXNTdHJpbmcsIG1pY3Jvc2Vjb25kc30gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQgZW52IGZyb20gXCIuL2VudlwiXG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gXCIuL3Jlc3BvbnNlc1wiXG5pbXBvcnQge21kNSwgaGFzaENoZWNrLCB0b1N0cmluZ30gZnJvbSBcIi4vY2FjaGVcIlxuaW1wb3J0IHttYXRjaENPUlN9IGZyb20gXCIuL2NvcnNcIlxuaW1wb3J0IHtpc0NvbXByZXNzaWJsZSwgZ3ppcH0gZnJvbSBcIi4vY29tcHJlc3NcIlxuXG57aW52b2tlfSA9IFN1bmRvZyhTREspLkFXUy5MYW1iZGEoKVxuXG5leGVjdXRlID0gKGNvbnRleHQpIC0+XG4gIHtwYXJ0aXRpb259ID0gY29udGV4dC5tYXRjaFxuXG4gIG5hbWUgPSBcIiN7ZW52Lm5hbWV9LSN7ZW52LmVudmlyb25tZW50fS0je3BhcnRpdGlvbn1cIlxuICBsb2dnZXIuZGVidWcgXCJEaXNwYXRjaGluZyB0byBsYW1iZGEgJyN7bmFtZX0nXCJcblxuICBzdGFydCA9IG1pY3Jvc2Vjb25kcygpXG4gIHtQYXlsb2FkfSA9IGF3YWl0IGludm9rZSBuYW1lLCBjb250ZXh0XG4gIGxvZ2dlci5pbmZvIFwiRGlzcGF0Y2ggSGFuZGxlciBEdXJhdGlvbjogI3soKG1pY3Jvc2Vjb25kcygpIC0gc3RhcnQpIC8gMTAwMCkudG9GaXhlZCgyKX1tc1wiXG5cbiAge3Jlc3BvbnNlLCBoYW5kbGVyRXJyb3J9ID0gZnJvbUpTT04gUGF5bG9hZC50b1N0cmluZygpXG4gIGlmIGhhbmRsZXJFcnJvclxuICAgIHRocm93IFJlc3BvbnNlcy5oeWRyYXRlIGhhbmRsZXJFcnJvclxuICBlbHNlXG4gICAgY29udGV4dC5yZXNwb25zZSA9IHJlc3BvbnNlXG5cbiAgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIiB0aGVuIGJyZWFrXG4gICAgICB3aGVuIFwiZ3ppcFwiXG4gICAgICAgIGJ1ZmZlciA9IEJ1ZmZlci5mcm9tICh0b1N0cmluZyBib2R5KSwgXCJ1dGY4XCJcbiAgICAgICAgaWYgaXNDb21wcmVzc2libGUgYnVmZmVyLCBjb250ZXh0Lm1hdGNoLmFjY2VwdFxuICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IGF3YWl0IGd6aXAgYnVmZmVyXG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5pc0Jhc2U2NEVuY29kZWQgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcbiAgaWYgbWF4QWdlID0gbWF0Y2guc2lnbmF0dXJlcy5yZXNwb25zZS5jYWNoZT8ubWF4QWdlXG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm1heC1hZ2U9I3ttYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoe3Jlc3BvbnNlfSkgLT5cbiAge2NvZGUsIHRhZywgaGVhZGVycywgYm9keSwgaXNCYXNlNjRFbmNvZGVkPWZhbHNlfSA9IHJlc3BvbnNlXG5cbiAgc3RhdHVzQ29kZTogY29kZVxuICBzdGF0dXNEZXNjcmlwdGlvbjogdGFnXG4gIGhlYWRlcnM6IGhlYWRlcnNcbiAgYm9keTogYm9keVxuICBpc0Jhc2U2NEVuY29kZWQ6IGlzQmFzZTY0RW5jb2RlZFxuXG5kaXNwYXRjaCA9IGZsb3cgW1xuICBleGVjdXRlXG4gIHN0YW1wXG4gIHJlc3BvbmRcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
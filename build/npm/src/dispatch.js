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
  var Payload, name, partition, start;
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

  context.response = (0, _pandaParchment.fromJSON)(Payload.toString()).response;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVRBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO0FBV0EsQ0FBQTtBQUFBLEVBQUE7QUFBQSxJQUFXLHFCQUFBLGVBQUEsRUFBWSxHQUFaLENBQVgsTUFBVyxFQUFYOztBQUVBLE9BQUEsR0FBVSxnQkFBQSxPQUFBLEVBQUE7QUFDUixNQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUE7QUFBQSxHQUFBO0FBQUEsSUFBQTtBQUFBLE1BQWMsT0FBTyxDQUFyQixLQUFBO0FBRUEsRUFBQSxJQUFBLEdBQU8sR0FBRyxhQUFILElBQUEsSUFBZSxhQUFmLFdBQUEsSUFBQSxTQUFBLEVBQVA7O0FBQ0Esa0JBQUEsS0FBQSxDQUFhLDBCQUFBLElBQWIsR0FBQTs7QUFFQSxFQUFBLEtBQUEsR0FBUSxtQ0FBUjtBQUNBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBWSxNQUFNLE1BQUEsQ0FBQSxJQUFBLEVBQWxCLE9BQWtCLENBQWxCOztBQUNBLGtCQUFBLElBQUEsQ0FBWSw4QkFBOEIsQ0FBQyxDQUFDLHNDQUFELEtBQUEsSUFBRCxJQUFBLEVBQUEsT0FBQSxDQUE5QixDQUE4QixDQUExQyxJQUFBOztBQUVBLEVBQUEsT0FBTyxDQUFQLFFBQUEsR0FBb0IsOEJBQVMsT0FBTyxDQUFqQixRQUFVLEVBQVQsQ0FBRCxDQUE4QixRQUFqRDtTQUNBLE87QUFYUSxDQUFWOztBQWFBLGFBQUEsR0FBZ0IsZ0JBQUEsT0FBQSxFQUFBO0FBQ2QsTUFBQSxJQUFBLEVBQUEsTUFB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VUFBQSxFQUFBLFdBQUEsRUFBQSxlQUFBLEVBQUwsWUFBSyxDQUFMLENBQVI7O0FBUUEsT0FBQSxHQUFVLFVBQUM7QUFBRCxFQUFBO0FBQUMsQ0FBRCxFQUFBO0FBQ1IsTUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxlQUFBLEVBQUEsR0FBQTtBQUFBLEdBQUE7QUFBQSxJQUFBLElBQUE7QUFBQSxJQUFBLEdBQUE7QUFBQSxJQUFBLE9BQUE7QUFBQSxJQUFBLElBQUE7QUFBMkIsSUFBQSxlQUFBLEdBQTNCO0FBQUEsTUFBQSxRQUFBO1NBRUE7QUFBQSxJQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsSUFBQSxpQkFBQSxFQURBLEdBQUE7QUFFQSxJQUFBLE9BQUEsRUFGQSxPQUFBO0FBR0EsSUFBQSxJQUFBLEVBSEEsSUFBQTtBQUlBLElBQUEsZUFBQSxFQUFpQjtBQUpqQixHO0FBSFEsQ0FBVjs7QUFTQSxRQUFBLEdBQVcsdUJBQUssQ0FBQSxPQUFBLEVBQUEsS0FBQSxFQUFMLE9BQUssQ0FBTCxDQUFYO2VBTWUsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTREsgZnJvbSBcImF3cy1zZGtcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcbmltcG9ydCB7Zmxvd30gZnJvbSBcInBhbmRhLWdhcmRlblwiXG5pbXBvcnQge2ZpcnN0LCBpbmNsdWRlLCBmcm9tSlNPTiwgdG9KU09OLCBpc1N0cmluZywgbWljcm9zZWNvbmRzfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCBlbnYgZnJvbSBcIi4vZW52XCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcbmltcG9ydCBSZXNwb25zZXMgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCB7bWQ1LCBoYXNoQ2hlY2ssIHRvU3RyaW5nfSBmcm9tIFwiLi9jYWNoZVwiXG5pbXBvcnQge21hdGNoQ09SU30gZnJvbSBcIi4vY29yc1wiXG5pbXBvcnQge2lzQ29tcHJlc3NpYmxlLCBnemlwfSBmcm9tIFwiLi9jb21wcmVzc1wiXG5cbntpbnZva2V9ID0gU3VuZG9nKFNESykuQVdTLkxhbWJkYSgpXG5cbmV4ZWN1dGUgPSAoY29udGV4dCkgLT5cbiAge3BhcnRpdGlvbn0gPSBjb250ZXh0Lm1hdGNoXG5cbiAgbmFtZSA9IFwiI3tlbnYubmFtZX0tI3tlbnYuZW52aXJvbm1lbnR9LSN7cGFydGl0aW9ufVwiXG4gIGxvZ2dlci5kZWJ1ZyBcIkRpc3BhdGNoaW5nIHRvIGxhbWJkYSAnI3tuYW1lfSdcIlxuXG4gIHN0YXJ0ID0gbWljcm9zZWNvbmRzKClcbiAge1BheWxvYWR9ID0gYXdhaXQgaW52b2tlIG5hbWUsIGNvbnRleHRcbiAgbG9nZ2VyLmluZm8gXCJEaXNwYXRjaCBIYW5kbGVyIER1cmF0aW9uOiAjeygobWljcm9zZWNvbmRzKCkgLSBzdGFydCkgLyAxMDAwKS50b0ZpeGVkKDIpfW1zXCJcblxuICBjb250ZXh0LnJlc3BvbnNlID0gKGZyb21KU09OIFBheWxvYWQudG9TdHJpbmcoKSkucmVzcG9uc2VcbiAgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIiB0aGVuIGJyZWFrXG4gICAgICB3aGVuIFwiZ3ppcFwiXG4gICAgICAgIGJ1ZmZlciA9IEJ1ZmZlci5mcm9tICh0b1N0cmluZyBib2R5KSwgXCJ1dGY4XCJcbiAgICAgICAgaWYgaXNDb21wcmVzc2libGUgYnVmZmVyLCBjb250ZXh0Lm1hdGNoLmFjY2VwdFxuICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IGF3YWl0IGd6aXAgYnVmZmVyXG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5pc0Jhc2U2NEVuY29kZWQgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcbiAgaWYgbWF4QWdlID0gbWF0Y2guc2lnbmF0dXJlcy5yZXNwb25zZS5jYWNoZT8ubWF4QWdlXG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm1heC1hZ2U9I3ttYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoe3Jlc3BvbnNlfSkgLT5cbiAge2NvZGUsIHRhZywgaGVhZGVycywgYm9keSwgaXNCYXNlNjRFbmNvZGVkPWZhbHNlfSA9IHJlc3BvbnNlXG5cbiAgc3RhdHVzQ29kZTogY29kZVxuICBzdGF0dXNEZXNjcmlwdGlvbjogdGFnXG4gIGhlYWRlcnM6IGhlYWRlcnNcbiAgYm9keTogYm9keVxuICBpc0Jhc2U2NEVuY29kZWQ6IGlzQmFzZTY0RW5jb2RlZFxuXG5kaXNwYXRjaCA9IGZsb3cgW1xuICBleGVjdXRlXG4gIHN0YW1wXG4gIHJlc3BvbmRcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2hcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
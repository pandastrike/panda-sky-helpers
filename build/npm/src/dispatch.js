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

  _logger.default.debug(`Dispatching ${context.match.data.resource} ${(0, _pandaParchment.toUpper)(context.match.method)} to lambda '${name}'`);

  start = (0, _pandaParchment.microseconds)();
  ({
    Payload
  } = await invoke(name, context));

  _logger.default.info(`Dispatch Handler Duration: ${(((0, _pandaParchment.microseconds)() - start) / 1000).toFixed(2)}ms`);

  ({
    response,
    handlerError
  } = (0, _pandaParchment.fromJSON)(Payload));

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

  if ((maxAge = (ref = match.signatures.response.cache) != null ? ref.maxAge : void 0) != null) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9wYW5kYS1za3ktaGVscGVycy9zcmMvZGlzcGF0Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVRBLElBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBO0FBV0EsQ0FBQTtBQUFBLEVBQUE7QUFBQSxJQUFXLHFCQUFBLGVBQUEsRUFBWSxHQUFaLENBQVgsTUFBVyxFQUFYOztBQUVBLE9BQUEsR0FBVSxnQkFBQSxPQUFBLEVBQUE7QUFDUixNQUFBLE9BQUEsRUFBQSxZQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQTtBQUFBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBYyxPQUFPLENBQXJCLEtBQUE7QUFFQSxFQUFBLElBQUEsR0FBTyxHQUFHLGFBQUgsSUFBQSxJQUFlLGFBQWYsV0FBQSxJQUFBLFNBQUEsRUFBUDs7QUFDQSxrQkFBQSxLQUFBLENBQWEsZUFBZSxPQUFPLENBQUMsS0FBUixDQUFjLElBQWQsQ0FBZixRQUFBLElBQThDLDZCQUFRLE9BQU8sQ0FBQyxLQUFSLENBQXRELE1BQThDLENBQTlDLGVBQUEsSUFBYixHQUFBOztBQUVBLEVBQUEsS0FBQSxHQUFRLG1DQUFSO0FBQ0EsR0FBQTtBQUFBLElBQUE7QUFBQSxNQUFZLE1BQU0sTUFBQSxDQUFBLElBQUEsRUFBbEIsT0FBa0IsQ0FBbEI7O0FBQ0Esa0JBQUEsSUFBQSxDQUFZLDhCQUE4QixDQUFDLENBQUMsc0NBQUQsS0FBQSxJQUFELElBQUEsRUFBQSxPQUFBLENBQTlCLENBQThCLENBQTFDLElBQUE7O0FBRUEsR0FBQTtBQUFBLElBQUEsUUFBQTtBQUFBLElBQUE7QUFBQSxNQUEy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Q0FBTCxDQUFYO2VBTWUsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTREsgZnJvbSBcImF3cy1zZGtcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcbmltcG9ydCB7Zmxvd30gZnJvbSBcInBhbmRhLWdhcmRlblwiXG5pbXBvcnQge2ZpcnN0LCBpbmNsdWRlLCBmcm9tSlNPTiwgdG9KU09OLCBpc1N0cmluZywgbWljcm9zZWNvbmRzLCB0b1VwcGVyfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCBlbnYgZnJvbSBcIi4vZW52XCJcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCJcbmltcG9ydCBSZXNwb25zZXMgZnJvbSBcIi4vcmVzcG9uc2VzXCJcbmltcG9ydCB7bWQ1LCBoYXNoQ2hlY2ssIHRvU3RyaW5nfSBmcm9tIFwiLi9jYWNoZVwiXG5pbXBvcnQge21hdGNoQ09SU30gZnJvbSBcIi4vY29yc1wiXG5pbXBvcnQge2lzQ29tcHJlc3NpYmxlLCBnemlwfSBmcm9tIFwiLi9jb21wcmVzc1wiXG5cbntpbnZva2V9ID0gU3VuZG9nKFNESykuQVdTLkxhbWJkYSgpXG5cbmV4ZWN1dGUgPSAoY29udGV4dCkgLT5cbiAge3BhcnRpdGlvbn0gPSBjb250ZXh0Lm1hdGNoXG5cbiAgbmFtZSA9IFwiI3tlbnYubmFtZX0tI3tlbnYuZW52aXJvbm1lbnR9LSN7cGFydGl0aW9ufVwiXG4gIGxvZ2dlci5kZWJ1ZyBcIkRpc3BhdGNoaW5nICN7Y29udGV4dC5tYXRjaC5kYXRhLnJlc291cmNlfSAje3RvVXBwZXIgY29udGV4dC5tYXRjaC5tZXRob2R9IHRvIGxhbWJkYSAnI3tuYW1lfSdcIlxuXG4gIHN0YXJ0ID0gbWljcm9zZWNvbmRzKClcbiAge1BheWxvYWR9ID0gYXdhaXQgaW52b2tlIG5hbWUsIGNvbnRleHRcbiAgbG9nZ2VyLmluZm8gXCJEaXNwYXRjaCBIYW5kbGVyIER1cmF0aW9uOiAjeygobWljcm9zZWNvbmRzKCkgLSBzdGFydCkgLyAxMDAwKS50b0ZpeGVkKDIpfW1zXCJcblxuICB7cmVzcG9uc2UsIGhhbmRsZXJFcnJvcn0gPSBmcm9tSlNPTiBQYXlsb2FkXG4gIGlmIGhhbmRsZXJFcnJvclxuICAgIHRocm93IFJlc3BvbnNlcy5oeWRyYXRlIGhhbmRsZXJFcnJvclxuICBlbHNlXG4gICAgY29udGV4dC5yZXNwb25zZSA9IHJlc3BvbnNlXG5cbiAgY29udGV4dFxuXG5tYXRjaEVuY29kaW5nID0gKGNvbnRleHQpIC0+XG4gIHttZWRpYXR5cGV9ID0gY29udGV4dC5tYXRjaC5zaWduYXR1cmVzLnJlc3BvbnNlXG4gIHtib2R5LCBlbmNvZGVSZWFkeX0gPSBjb250ZXh0LnJlc3BvbnNlXG5cbiAgaWYgbWVkaWF0eXBlICYmIGJvZHk/ICYmICFlbmNvZGVSZWFkeVxuICAgIHN3aXRjaCBjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nXG4gICAgICB3aGVuIFwiaWRlbnRpdHlcIlxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB0b0pTT04gYm9keSB1bmxlc3MgaXNTdHJpbmcgYm9keVxuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnNbXCJDb250ZW50LUVuY29kaW5nXCJdID0gXCJpZGVudGl0eVwiXG4gICAgICAgIGNvbnRleHQucmVzcG9uc2UuaXNCYXNlNjRFbmNvZGVkID0gZmFsc2VcbiAgICAgIHdoZW4gXCJnemlwXCJcbiAgICAgICAgYnVmZmVyID0gQnVmZmVyLmZyb20gKHRvU3RyaW5nIGJvZHkpLCBcInV0ZjhcIlxuICAgICAgICBpZiBpc0NvbXByZXNzaWJsZSBidWZmZXIsIGNvbnRleHQubWF0Y2guYWNjZXB0XG4gICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gYXdhaXQgZ3ppcCBidWZmZXJcbiAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmlzQmFzZTY0RW5jb2RlZCA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnRleHQubWF0Y2guYWNjZXB0RW5jb2RpbmcgPSBcImlkZW50aXR5XCJcbiAgICAgICAgICBjb250ZXh0ID0gbWF0Y2hFbmNvZGluZyBjb250ZXh0XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkJhZCBlbmNvZGluZzogI3tjb250ZXh0Lm1hdGNoLmFjY2VwdEVuY29kaW5nfVwiXG5cbiAgY29udGV4dFxuXG5tYXRjaENhY2hlID0gKGNvbnRleHQpIC0+XG4gIHtyZXNwb25zZTp7Ym9keX0sIG1hdGNofSA9IGNvbnRleHRcblxuICBpZiBjdXJyZW50ID0gaGFzaENoZWNrIG1hdGNoLCBib2R5XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIEVUYWc6IGN1cnJlbnRcbiAgaWYgKG1heEFnZSA9IG1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2UuY2FjaGU/Lm1heEFnZSk/XG4gICAgaW5jbHVkZSBjb250ZXh0LnJlc3BvbnNlLmhlYWRlcnMsIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm1heC1hZ2U9I3ttYXhBZ2V9XCJcblxuICBjb250ZXh0XG5cbm1hdGNoU3RhdHVzID0gKGNvbnRleHQpIC0+XG4gIGNvZGUgPSBmaXJzdCBjb250ZXh0Lm1hdGNoLnNpZ25hdHVyZXMucmVzcG9uc2Uuc3RhdHVzXG4gIGluY2x1ZGUgY29udGV4dC5yZXNwb25zZSwge2NvZGV9LCB0YWc6IFJlc3BvbnNlc1tjb2RlXVxuICBjb250ZXh0XG5cbm1hdGNoSGVhZGVycyA9IChjb250ZXh0KSAtPlxuICB7YWNjZXB0LCBhY2NlcHRFbmNvZGluZywgc2lnbmF0dXJlc30gPSBjb250ZXh0Lm1hdGNoXG5cbiAgaWYgc2lnbmF0dXJlcy5yZXNwb25zZS5tZWRpYXR5cGVcbiAgICBpbmNsdWRlIGNvbnRleHQucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IGFjY2VwdFxuICAgICAgXCJDb250ZW50LUVuY29kaW5nXCI6IGFjY2VwdEVuY29kaW5nXG4gICAgICBWYXJ5OiBcIkFjY2VwdCwgQWNjZXB0LUVuY29kaW5nXCJcblxuICBjb250ZXh0XG5cblxuXG5cbnN0YW1wID0gZmxvdyBbXG4gIG1hdGNoRW5jb2RpbmdcbiAgbWF0Y2hDYWNoZVxuICBtYXRjaFN0YXR1c1xuICBtYXRjaENPUlNcbiAgbWF0Y2hIZWFkZXJzXG5dXG5cbnJlc3BvbmQgPSAoY29udGV4dCkgLT5cbiAge2NvZGUsIHRhZywgaGVhZGVycywgYm9keSwgaXNCYXNlNjRFbmNvZGVkPWZhbHNlfSA9IGNvbnRleHQucmVzcG9uc2VcblxuICBzdGF0dXNDb2RlOiBjb2RlXG4gIHN0YXR1c0Rlc2NyaXB0aW9uOiB0YWdcbiAgaGVhZGVyczogaGVhZGVyc1xuICBib2R5OiBib2R5XG4gIGlzQmFzZTY0RW5jb2RlZDogaXNCYXNlNjRFbmNvZGVkXG5cbmRpc3BhdGNoID0gZmxvdyBbXG4gIGV4ZWN1dGVcbiAgc3RhbXBcbiAgcmVzcG9uZFxuXVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaFxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/panda-sky-helpers/src/dispatch.coffee
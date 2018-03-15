"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aws = exports.log = exports.dispatch = exports.method = exports.response = exports.env = undefined;

require("source-map-support/register");

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _dispatch = require("./dispatch");

var _dispatch2 = _interopRequireDefault(_dispatch);

var _method = require("./method");

var _method2 = _interopRequireDefault(_method);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

var _responses = require("./responses");

var _responses2 = _interopRequireDefault(_responses);

var _sundog = require("sundog");

var _sundog2 = _interopRequireDefault(_sundog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Before we get started, first install source mapping support.
var aws, sky;

exports.aws = aws = function (sdk) {
  return (0, _sundog2.default)(sdk).AWS;
};

sky = { env: _env2.default, response: _responses2.default, method: _method2.default, dispatch: _dispatch2.default, log: _logger2.default, aws };

exports.default = sky;
exports.env = _env2.default;
exports.response = _responses2.default;
exports.method = _method2.default;
exports.dispatch = _dispatch2.default;
exports.log = _logger2.default;
exports.aws = aws;
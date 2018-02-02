"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var debug, error, info, logger, warn;

debug = function (...messages) {
  return console.log("DEBUG", ...messages);
};

info = function (...messages) {
  return console.log("INFO", ...messages);
};

warn = function (...messages) {
  return console.log("WARN", ...messages);
};

error = function (...messages) {
  return console.log("ERROR", ...messages);
};

logger = {
  debug,
  info,
  log: info,
  warn,
  error
};

exports.default = logger;
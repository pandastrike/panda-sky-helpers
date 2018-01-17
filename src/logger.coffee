debug = (messages...) -> console.log "DEBUG", messages...
info = (messages...) -> console.log "INFO", messages...
warn = (messages...) -> console.log "WARN", messages...
error = (messages...) -> console.log "ERROR", messages...

logger = {
  debug
  info
  log: info
  warn
  error
}

export default logger

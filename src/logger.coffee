debug = (messages...) -> console.log "DEBUG", messages...
info = (messages...) -> console.log "INFO", messages...
warn = (messages...) -> console.log "WARN", messages...
error = (messages...) -> console.log "ERROR", messages...
json = (obj) -> console.log "JSON", JSON.stringify obj

logger = {
  debug
  info
  json
  log: info
  warn
  error
}

export default logger

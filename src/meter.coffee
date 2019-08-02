import log from "./logger"
import {microseconds} from "panda-parchment"

meter = (label, fn) ->
  (args...) ->
    start = microseconds()
    result = await fn args...
    log.json "#{label}": ((microseconds() - start) / 1000).toFixed(2)
    result

export default meter

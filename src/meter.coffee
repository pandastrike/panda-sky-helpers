import {microseconds} from "panda-parchment"

meter = (label, fn) ->
  (args...) ->
    start = microseconds()
    result = await fn args...
    console.log "#{label}": (microseconds() - start) / 1000
    result

export default meter

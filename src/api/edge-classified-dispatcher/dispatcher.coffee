import {flow} from "panda-garden"

import Dispatcher from "../dispatcher"
import classify from "./classify"
import execute from "../execute"

setup = (start, request, resources, handlers) ->
  response = headers: {}
  {start, request, resources, handlers, response}

dispatcher = Dispatcher flow [setup, classify, execute]

export default dispatcher

import dispatcher from "./dispatcher"
import {buildRouter, importHandlers} from "../../utils/load"

load = (root) ->
  Promise.all [
    buildRouter root
    importHandlers root
  ]

bundle = {load, dispatcher}

export default bundle

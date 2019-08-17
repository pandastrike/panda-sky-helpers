import dispatcher from "./dispatcher"
import {readAPIDef, importHandlers} from "../../utils/load"

load = (root) ->
  Promise.all [
    readAPIDef root
    importHandlers root
  ]

bundle = {load, dispatcher}

export default bundle

# Before we get started, first install source mapping support.
import "source-map-support/register"
import Sundog from "sundog"

import env from "./env"
import log from "./logger"
import parse from "./parse"
import dispatcher from "./dispatcher"
import classify from "./classify"
import dispatch from "./dispatch"
import respond from "./respond"

aws = (sdk) -> Sundog(sdk).AWS

sky = {
  env
  log
  aws
  parse
  dispatcher
  classify
  dispatch
  respond
}

export default sky
export {
  env
  log
  aws
  parse
  dispatcher
  classify
  dispatch
  respond
}

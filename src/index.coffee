# Before we get started, first install source mapping support.
import "source-map-support/register"
import Sundog from "sundog"

import env from "./env"
import log from "./logger"
import meter from "./meter"
import responses from "./responses"
import load from "./load"
import dispatcher from "./dispatcher"
import classify from "./classify"
import dispatch from "./dispatch"
import {timeCheck, hashCheck} from "./cache"

aws = (sdk) -> Sundog(sdk).AWS

sky = {
  env
  log
  meter
  aws
  responses
  load
  dispatcher
  classify
  dispatch
  timeCheck
  hashCheck
}

export default sky
export {
  env
  log
  meter
  aws
  responses
  load
  dispatcher
  classify
  dispatch
  timeCheck
  hashCheck
}

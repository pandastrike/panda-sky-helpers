import "source-map-support/register"
import Sundog from "sundog"

import meter from "./utils/meter"
import responses from "./utils/responses"
import {checks} from "./utils/cache"
import api from "./api"
import edge from "./edge"

aws = (sdk) -> Sundog(sdk).AWS

sky = {
  aws
  meter
  responses
  checks
  api
  edge
}

export default sky
export {
  aws
  meter
  responses
  checks
  api
  edge
}

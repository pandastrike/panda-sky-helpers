# Before we get started, first install source mapping support.
import "source-map-support/register"

# The library root accepts an instanciated AWS SDK when invoked.  This gives the
# helpers the same access as the invoking Lambda.  We then pass that off to our
# functional wrapper library SunDog to access a really powerful interface.

import env from "./env"
import dispatch from "./dispatch"
import method from "./method"
import response from "./responses"
import Sundog from "sundog"

sky = (_AWS_) ->
  {_AWS: liftedAWS, AWS, Helpers: SundogHelpers} = Sundog _AWS_

  {
    env
    response
    method
    dispatch
    liftedAWS
    AWS
    SundogHelpers
  }

export default sky

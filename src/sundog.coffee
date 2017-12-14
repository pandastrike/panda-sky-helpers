import _Sundog from "sundog"

Sundog = (awsInstance) ->
  {_AWS, AWS, Helpers} = _Sundog awsInstance
  AWS.liftedAWS = _AWS
  AWS.SundogHelpers = Helpers
  AWS

export default Sundog

# The library root accepts an instanciated AWS SDK when invoked.  This gives the
# helpers the same access as the invoking Lambda.

# For example,
# when accessing S3, the library can only access buckets to which the inovking
# Lamdba could access with its own AWS SDK that is natively loaded into the
# runtime.
import env from "./env"
import dispatch from "./dispatch"
import method from "./method"
import response from "./responses"
import s3 from "./s3"

sky = (AWS) ->
  {
    env
    response
    method
    dispatch
    s3: s3 AWS
  }

export default sky

import {toLower, toJSON, dashed, sleep} from "panda-parchment"
import logger from "./logger"
import Responses from "./responses"
{NotImplemented} = Responses

methodDispatcher = (context) ->
  {root, match:{data:{resource}, method}} = context
  logger.info resource, method
  try
    f = (require resolve root, "handlers", (dashed resource), (toLower method)).default
  catch e
    throw new NotImplemented "no handler for #{method} #{resource}"

  await f context

export default methodDispatcher

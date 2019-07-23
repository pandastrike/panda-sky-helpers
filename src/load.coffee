{resolve, parse:_parse} = require "path"
{readdirSync} = require "fs"
{method} = require "panda-sky-helpers"

parse = (path) -> _parse(path).name

# TODO: Use asynchronous forms to load these faster.
load = (path) ->
  resources = {}

  for resource in readdirSync path
    resources[resource] = {}
    for verb in readdirSync resolve path, resource
      v = parse verb
      resources[resource][v] = (require resolve path, resource, v).default

  resources

export default load

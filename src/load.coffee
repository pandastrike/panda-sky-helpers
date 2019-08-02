import {resolve, parse as _parse} from "path"
import {fromJSON, toJSON, merge, sleep} from "panda-parchment"
import {read, ls} from "panda-quill"
import {Router} from "panda-router"

import log from "./logger"
import meter from "./meter"

buildRouter = (root) ->
  {resources} = fromJSON await read resolve root, "api", "json", "identity"
  router = new Router()
  for r, {template, methods} of resources
    router.add
      template: template
      data:
        resource: r
        template: template
        methods: methods

  router

parse = (path) -> _parse(path).name

importHandlers = (root) ->
  resources = {}

  for path in await ls resolve root, "handlers"
    resource = parse path
    resources[resource] = {}
    for file in await ls resolve root, "handlers", resource
      verb = parse file
      resources[resource][verb] =
        (require resolve root, "handlers", resource, verb).default

  resources

load = (root) ->
  Promise.all [
    buildRouter root
    importHandlers root
  ]

export default load

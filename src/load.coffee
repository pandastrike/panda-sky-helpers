import {resolve, join, relative, dirname, basename} from "path"
import {flow, wrap, tee} from "panda-garden"
import {map} from "panda-river"
import {fromJSON, toJSON, merge, sleep, microseconds} from "panda-parchment"
import {Router} from "panda-router"

import meter from "./meter"

buildRouter = (resources) ->
  router = new Router()
  for r, {template, methods} of resources
    router.add
      template: template
      data:
        resource: r
        template: template
        methods: methods

  router

export default buildRouter

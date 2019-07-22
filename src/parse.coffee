import {fromJSON} from "panda-parchment"
import {Router} from "panda-router"

parse = (definition) ->
  router = new Router()
  for r, {template, methods} of definition.resources
    router.add
      template: template
      data:
        resource: r
        template: template
        methods: methods

  {definition, router}

export default parse

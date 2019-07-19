import {yaml} from "panda-serialize"
import {read} from "panda-quill"
import {Router} from "panda-router"

parse = (path) ->
  definition = yaml await read path
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

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SecretKeyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const mst = ctx.session.get("mst")
    //console.log(mst)
    const url =  ctx.request.url().split('/');
    if(!mst && url.length==3 && url[2] != 'login-key'){
        ctx.response.redirect().toPath('login-key')
    }else if(mst && url.length == 3 && url[2] == 'login-key'){     
        ctx.response.redirect().toPath('index')
    }else{

    }
    /**
     * Call next method in the pipeline and return its output
     */
    await next()
  }
}
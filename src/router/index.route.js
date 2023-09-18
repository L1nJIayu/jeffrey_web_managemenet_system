const Router = require('@koa/router')

const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = 'Hello Koa2!!'
})

module.exports = router.routes()	// 返回一个函数，此函数可作为中间件
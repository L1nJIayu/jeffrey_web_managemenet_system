const Router = require('@koa/router')

const { login, register, getUserList } = require('../controller/user.controller.js')	// 引用时直接解构获取处理函数

const router = new Router({
  prefix: '/user'
})

/* 不写逻辑，只写路由 */
router.post('/login', login)
router.post('/register', register)
router.get('/list', getUserList)

module.exports = router.routes()
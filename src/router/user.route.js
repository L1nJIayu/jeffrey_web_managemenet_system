const Router = require('@koa/router')

const { login, register, getUserList } = require('../controller/user.controller.js')	// 引用时直接解构获取处理函数
const { userRegisterValidator } = require('../middleware/user.middleware')

const router = new Router({
  prefix: '/user'
})


// 登录
router.post('/login', login)

// 注册
router.post('/register', userRegisterValidator, register)

// 用户列表
router.get('/list', getUserList)

module.exports = router.routes()
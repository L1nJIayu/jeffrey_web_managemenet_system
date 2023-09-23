const Router = require('@koa/router')

const { login, register, getUserList, getUserInfo, modifyPassword } = require('../controller/user.controller.js')	// 引用时直接解构获取处理函数

const { userRegisterValidator, cryptPassword, userLoginValidator, validatePassword } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')

const router = new Router({
  prefix: '/user'
})


// 登录
router.post('/login', userLoginValidator, validatePassword, login)

// 注册
router.post('/register', userRegisterValidator, cryptPassword, register)

// 用户列表
router.get('/list', auth, getUserList)

// 用户信息（根据ID获取）
router.get('/:id', auth, getUserInfo)

// 修改密码
router.patch('/modifyPassword', auth, cryptPassword, modifyPassword)

module.exports = router.routes()
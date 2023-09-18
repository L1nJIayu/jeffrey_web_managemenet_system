const { createUser } = require('../service/user.service')

class UserController {
  async register(ctx, next) {
    try {
      await createUser(ctx.request.body)
      ctx.body = {
        code: 2000,
        data: ctx.request.body,
        message: '恭喜！用户注册成功！'
      }
    } catch (err) {
      console.error(err)
      ctx.body = {
        code: 5000,
        data: null,
        message: '用户注册失败' + err
      }
    }
  }
  login(ctx, next) {
    ctx.body = {
      code: 2000,
      data: null,
      message: "登录成功！",
    }
  }
}

module.exports = new UserController() // 暴露出去的应该是一个实例，使用时可直接结构获取里面的函数

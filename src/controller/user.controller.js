const UserService = require('../service/user.service')
const { RES_CODE_SUCCESS, RES_CODE_ERROR } = require('../config/default.config')

class UserController {
  async register(ctx, next) {
    try {
      await UserService.createUser(ctx.request.body)
      ctx.body = {
        code: RES_CODE_SUCCESS,
        data: ctx.request.body,
        message: '恭喜！用户注册成功！'
      }
    } catch (err) {
      console.error(err)
      ctx.body = {
        code: RES_CODE_ERROR,
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

  // 获取用户列表
  async getUserList(ctx, next) {
    try {
      console.log(ctx.query)
      const result = await UserService.getUserList(ctx.query)

      ctx.body = {
        code: RES_CODE_SUCCESS,
        data: result,
        message: '查询成功'
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

module.exports = new UserController() // 暴露出去的应该是一个实例，使用时可直接结构获取里面的函数

const UserService = require('../service/user.service')
const { RES_CODE_SUCCESS, RES_CODE_ERROR } = require('../constants')
const { Service_Error } = require('../constants/error.type')
const { getResponseBody } = require('../utils')

class UserController {

  async register(ctx) {
    try {
      await UserService.createUser(ctx.request.body)
      ctx.body = getResponseBody({
        code: RES_CODE_SUCCESS,
        result: ctx.request.body,
        message: '恭喜！用户注册成功！'
      })
    } catch (error) {
      ctx.app.emit('error', {
        responseBody: getResponseBody(Service_Error),
        ctx,
        error
      })
    }
  }

  async login(ctx) {
    ctx.body = {
      code: 2000,
      data: null,
      message: "登录成功！",
    }
  }

  // 获取用户列表
  async getUserList(ctx) {
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

  // 获取用户信息
  async getUserByUserName(user_name) {
    try {
      return await UserService.getUserByUserName(user_name)
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }
}

module.exports = new UserController() // 暴露出去的应该是一个实例，使用时可直接结构获取里面的函数

const UserService = require('../service/user.service')
const { RES_CODE_SUCCESS } = require('../constants')
const {
  serviceError,
  userLoginError,
  paramsFormatError,
  userNotFoundError,
} = require('../constants/error.type')
const { getResponseBody } = require('../utils')
const { JWT_SECRET } = require('../config/default.config')

const jwt = require('jsonwebtoken')

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
        responseBody: getResponseBody(serviceError),
        ctx,
        error
      })
    }
  }

  async login(ctx) {
    try {
      const { user_name } = ctx.request.body
      const { password, ...userInfo } = await UserService.getUserInfo({ user_name })
      const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: '30d'})
      ctx.body = getResponseBody({
        code: RES_CODE_SUCCESS,
        message: '用户登录成功！',
        result: {
          token
        }
      })
    } catch (error) {
      ctx.app.emit('error', {
        responseBody: getResponseBody(userLoginError),
        ctx,
        error
      })
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

  // 根据ID获取用户信息
  async getUserInfo(ctx) {
    console.log('userInfo', ctx.state.userInfo)
    try {
      const { id } = ctx.params
      if(!id) {
        return ctx.app.emit('error', {
          ctx,
          responseBody: getResponseBody(paramsFormatError),
          error: new Error('ID为空')
        })
      }

      const user = await UserService.getUserInfo({ id })
      if(user) {
        ctx.app.emit('success', {
          ctx,
          result: user
        })
      } else {
        ctx.app.emit('error', {
          ctx,
          responseBody: getResponseBody(userNotFoundError)
        })
      }
    } catch (error) {
      ctx.app.emit('error', {
        ctx,
      })
    }
  }

  // 修改密码
  async modifyPassword(ctx) {
    try {
      const { id } = ctx.state.userInfo
      const { password }  = ctx.request.body

      if(!password) {
        return ctx.app.emit('error',{
          responseBody: getResponseBody(paramsFormatError),
          ctx,
          error: new Error('密码为空')
        })
        
      }
      
      await UserService.modifyUserInfo({ id, password })
      ctx.app.emit('success', { message: '密码修改成功', ctx})
    } catch (error) {
      ctx.app.emit('error',{
        responseBody: getResponseBody(serviceError),
        ctx,
        error
      })
    }
  }
}

module.exports = new UserController() // 暴露出去的应该是一个实例，使用时可直接结构获取里面的函数

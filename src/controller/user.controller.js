
const toCamelCase = require('camelcase-keys')

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

  async getUserList(ctx) {
    try {
      console.log(ctx.query)
      const originalResult = await UserService.getUserList(ctx.query)

      const result = originalResult.map(item => item.dataValues)

      ctx.body = {
        code: RES_CODE_SUCCESS,
        data: toCamelCase(result, { deep: true }),
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
          responseBody: getResponseBody({
            result: user
          }),
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
      ctx.app.emit('success', {
        ctx,
        responseBody: getResponseBody({
          message: '密码修改成功',
        })
      })
    } catch (error) {
      ctx.app.emit('error',{
        responseBody: getResponseBody(serviceError),
        ctx,
        error
      })
    }
  }

  async deleteUser(ctx) {
    const id = parseInt(ctx.request.params.id)
    
    if(!id) {
      return ctx.app.emit('error', {
        ctx,
        error: new Error('用户ID不能为空')
      })
    }

    const user = await UserService.getUserInfo({ id })
    if(!user) {
      return ctx.app.emit('error', {
        ctx,
        responseBody: getResponseBody(userNotFoundError)
      })
    } else {

      await UserService.deleteUser(id)

      ctx.app.emit('success', {
        ctx,
        responseBody: getResponseBody({
          message: '删除成功！'
        })
      })
      
    }
    
  }
}

module.exports = new UserController() // 暴露出去的应该是一个实例，使用时可直接结构获取里面的函数

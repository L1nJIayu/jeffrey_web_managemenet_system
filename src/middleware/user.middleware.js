const UserService = require('../service/user.service')
const {
  paramsFormatError,
  userAlreadyExisted,
  loginUserNameOrPasswordNullError,
  loginUserNameOrPasswordError,
  userLoginError
} = require('../constants/error.type')
const { getResponseBody } = require('../utils')
const bcrypt = require('bcryptjs')


// 用户注册参数验证
const userRegisterValidator = async (ctx, next) => {

  const { user_name, password } = ctx.request.body
  
  if(!user_name || !password) {
    ctx.app.emit('error', {
      responseBody: getResponseBody(paramsFormatError),
      ctx,
      error: new Error('用户名密码为空')
    })
    return
  }

  if(await UserService.getUserInfo({ user_name })) {
    ctx.app.emit('error', {
      responseBody: getResponseBody(userAlreadyExisted),
      ctx,
      error: new Error(userAlreadyExisted.message)
    })
    return
  }

  await next()

}

// 登录用户参数验证
const userLoginValidator = async (ctx, next) => {

  const { user_name, password } = ctx.request.body
  
  if(!user_name || !password) {
    return ctx.app.emit('error', {
      responseBody: getResponseBody(loginUserNameOrPasswordNullError),
      ctx,
      error: new Error('用户名密码为空')
    })
  }

  await next()
}

// 密码加密
const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  if(!password) {
    return ctx.app.emit('error',{
      responseBody: getResponseBody(paramsFormatError),
      ctx,
      error: new Error(paramsFormatError.message)
    })
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  ctx.request.body.password = hash

  await next()
}

// 密码验证
const validatePassword = async (ctx, next) => {
  try {

    const { user_name, password } = ctx.request.body

    const user = await UserService.getUserInfo({ user_name })
  
    if(user && bcrypt.compareSync(password, user.password)) {
      await next()
    } else {
      return ctx.app.emit('error', {
        responseBody: getResponseBody(loginUserNameOrPasswordError),
        ctx,
        error: new Error(loginUserNameOrPasswordError.message)
      })
    }
    
  } catch (error) {
    return ctx.app.emit('error', {
      responseBody: getResponseBody(userLoginError),
      ctx,
      error
    })
  }



}



module.exports = {
  userRegisterValidator,
  cryptPassword,
  userLoginValidator,
  validatePassword,
}
const { getUserByUserName } = require('../controller/user.controller')
const { getResponseBody } = require('../utils')

const userRegisterValidator = async (ctx, next) => {

  const { user_name, password } = ctx.request.body
  
  if(!user_name || !password) {
    ctx.app.emit('error', {
      responseBody: getResponseBody({
        code: '4001001',
        message: '用户名密码为空',
        data: null
      }),
      ctx,
      error: new Error('用户名密码为空')
    })
    return
  }

  if(await getUserByUserName(user_name)) {
    ctx.app.emit('error', {
      responseBody: getResponseBody({
        code: '4001002',
        message: '用户名已存在',
        data: null
      }),
      ctx,
      error: new Error('用户名已存在')
    })
    return
  }

  await next()

}


module.exports = {
  userRegisterValidator
}
const jwt = require('jsonwebtoken')
const { serviceError, tokenExpired, invalidToken } = require('../constants/error.type')
const { getResponseBody } = require('../utils')
const { JWT_SECRET } = require('../config/default.config')

const auth = async (ctx, next) => {

  
  try {
    const { authorization = '' } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    const userInfo = await jwt.verify(token, JWT_SECRET)
    ctx.state.userInfo = userInfo

    await next()
  } catch (error) {
    switch(error.name) {
      case 'TokenExpiredError':
        return ctx.app.emit('error', {
          responseBody: getResponseBody(tokenExpired),
          ctx,
          error
        })
      case 'JsonWebTokenError':
        return ctx.app.emit('error', {
          responseBody: getResponseBody(invalidToken),
          ctx,
          error
        })
      default:
        return ctx.app.emit('error', {
          responseBody: getResponseBody(serviceError),
          ctx,
          error
        })
    }
    
  }

}


module.exports = {
  auth
}
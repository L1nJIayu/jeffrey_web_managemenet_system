const { serviceError } = require('../constants/error.type')
module.exports = (opts) => {


  const {
    responseBody = serviceError,
    ctx,
    error = new Error(responseBody?.message)
  } = opts

  if(!ctx) {
    return console.error('错误处理函数中未获得ctx，请检查')
  }
  try {
  
    let status = 500
    switch (responseBody.code) {
      case '4001001':
      case '4001002':
        status = 400
        break;
    
      default:
        status = 500
        break;
    }
    ctx.status = status
    ctx.body = responseBody
    console.error('捕获到错误信息：', error)

  } catch (err) {
    console.error(opts)
    console.error('错误处理函数出错：', err)
  }
}
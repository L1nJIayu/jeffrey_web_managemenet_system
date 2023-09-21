module.exports = (opts) => {

  const {
    responseBody,
    ctx,
    error
  } = opts
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
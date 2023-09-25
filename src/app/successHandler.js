const { RES_CODE_SUCCESS } = require("../constants")

module.exports = (opts) => {
  const {
    responseBody,
    ctx,
  } = opts

  const {
    code=RES_CODE_SUCCESS,
    result=null,
    message='成功！'
  } = responseBody

  console.log(opts)

  ctx.body = {
    code,
    result,
    message
  }
}
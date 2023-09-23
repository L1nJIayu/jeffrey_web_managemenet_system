const { RES_CODE_SUCCESS } = require("../constants")

module.exports = (opts) => {
  const {
    message = '成功！',
    result = null,
    ctx,
  } = opts

  ctx.body = {
    code: RES_CODE_SUCCESS,
    result,
    message
  }
}
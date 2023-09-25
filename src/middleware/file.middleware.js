const {
  fileParamNotNullError,
  mimeTypeError
} = require('../constants/error.type')
const { getResponseBody } = require('../utils')

// 文件类型验证器
const imgMimeTypeValidator = async (ctx, next) => {
  try {
    const { file } = ctx.request.files

    if(!file) {
      return ctx.app.emit('error', {
        ctx,
        error: new Error('文件参数为空！'),
        responseBody: getResponseBody(fileParamNotNullError)
      })
    }

    const supportedMimeType = [
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]
    if(supportedMimeType.includes(file.mimetype)) {
      return await next()
    } else {
      return ctx.app.emit('error', {
        ctx,
        error: new Error('用户传的文件类型不支持！类型：' + file.mimetype),
        responseBody: getResponseBody(mimeTypeError)
      })
    }

  } catch (error) {
    return ctx.app.emit('error', { ctx, error })
  }

}


module.exports = {
  imgMimeTypeValidator
}
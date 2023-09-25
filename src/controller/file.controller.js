const FileService = require('../service/file.service')
const { getResponseBody } = require('../utils')

const { fileUploadError, getFileError } = require('../constants/error.type')

const uploadFile = async (ctx, next) => {
  try {
    const { file } = ctx.request.files
    
    const { file_name } = await FileService.createFile(file)

    ctx.app.emit('success', {
      ctx,
      responseBody: getResponseBody({
        message: '上传成功！',
        result: file_name
      })
    })
  } catch (error) {
    ctx.app.emit('error', {
      ctx,
      error,
      responseBody: getResponseBody(fileUploadError)
    })
  }


}

// const getFile = async (ctx) => {

//   try {
//     const { id } = ctx.request.params
//     // await FileService.getFile(id)
//   } catch (error) {
//     ctx.app.emit('error', {
//       ctx,
//       error,
//       responseBody: getResponseBody(getFileError)
//     })
//   }
// }

module.exports = {
  uploadFile
}
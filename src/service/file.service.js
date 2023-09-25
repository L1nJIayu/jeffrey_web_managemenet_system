const File = require('../model/file.model')


class FileService {
  async createFile (file) {
    const {
      newFilename,
      originalFilename,
      mimetype,
      filepath
    } = file
    return await File.create({
      file_name: newFilename,
      original_file_name: originalFilename,
      mime_type: mimetype,
      file_path: filepath,
    })
  }

  // async getFile (id) {
  //   return await File.findOne({
  //     where: {
  //       id
  //     }
  //   })
  // }
}

module.exports = new FileService()
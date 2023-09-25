const { DataTypes } = require('sequelize')
const seq = require('../db/seq')


const File = seq.define('file', {
  file_name: DataTypes.CHAR,
  original_file_name: DataTypes.CHAR,
  mime_type: DataTypes.CHAR,
  file_path: DataTypes.CHAR
}, {
  tableName: 't_files'
})

// File.sync({
//   alter: true
// })

module.exports = File
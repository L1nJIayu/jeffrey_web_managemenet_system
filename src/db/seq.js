const { Sequelize } = require('sequelize')

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PWD,
  DB_DIALECT,
} = require('../config/default.config')

const seq = new Sequelize({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PWD,
  dialect: DB_DIALECT
})


// testConnectDatabase()
// 连接测试
;(async () => {
  try {
    await seq.authenticate()
    console.log('数据库连接成功！')
  } catch (err) {
    console.error('数据库连接失败！', err)
  }
})();

module.exports = seq
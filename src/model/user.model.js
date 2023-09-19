const { DataTypes } = require('sequelize')
const seq = require('../db/seq')


const User = seq.define('User', {
  user_name: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.CHAR(255),
    allowNull: false,
    comment: '密码'
  },
  nick_name: {
    type: DataTypes.CHAR(64),
    comment: '昵称'
  },
  is_deleted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '是否被删除: 0:未删除 1:已删除'
  },
}, {
  tableName: 't_user'
})

// User.sync({
//   force: true,
// })

module.exports = User
const User = require('../model/user.model')
const { Op } = require('sequelize')

class UserService {
  async createUser(params) {
    try {
      const user = await User.create(params)
      console.log(JSON.stringify(user, null, 4))
      return user
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getUserList(params) {
    try {
      const result = await User.findAll({
        attributes: [
          'id',
          ['user_name', 'userName'],
          ['nick_name', 'nickName'],
          ['is_deleted', 'isDeleted'],
          ['createdAt', 'createTime']
        ]
      })
      console.log(JSON.stringify(result, null, 4))
      return result
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async modifyUser(params) {
    User.update()
  }
}

module.exports = new UserService()
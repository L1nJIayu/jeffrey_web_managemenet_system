const User = require('../model/user.model')
const { Op } = require('sequelize')

class UserService {
  
  async createUser(params) {
    const user = await User.create(params)
    console.log(JSON.stringify(user, null, 4))
    return user
  }

  async getUserList(params) {
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
  }

  async getUserByUserName(user_name) {
    const user = await User.findOne({
      where: {
        user_name: user_name
      }
    })
    console.log(JSON.stringify(user, null, 4))
    return user
  }
}

module.exports = new UserService()
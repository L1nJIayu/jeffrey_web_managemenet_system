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

  async getUserInfo(params) {
    const {
      id,
      user_name,
      password,
      nick_name
    } = params

    let whereOpt = {}
    
    id          && Object.assign(whereOpt, { id })
    user_name   && Object.assign(whereOpt, { user_name })
    password    && Object.assign(whereOpt, { password })
    nick_name   && Object.assign(whereOpt, { nick_name })

    const user = await User.findOne({
      where: whereOpt
    })
    return user ? user.dataValues : null

  }
  
  async modifyUserInfo(params) {
    await User.update(params, {
      where: {
        id: params.id
      }
    })
    
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
const User = require('../model/user.model')
const { Op } = require('sequelize')

const toCamelCase = require('camelcase-keys')

const seq = require('../db/seq')

class UserService {
  
  async createUser(params) {
    const user = await User.create(params)
    console.log(JSON.stringify(user, null, 4))
    return user
  }

  async getUserList(params) {
    const result = await User.findAll({
      where: {
        is_deleted: 0
      }
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

    let whereOpt = {
      is_deleted: 0
    }
    
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

  async deleteUser(id) {
    return seq.query(`
      UPDATE t_user 
      SET is_deleted = 1 
      WHERE
        id = ${ id }
    `)
  }
}

module.exports = new UserService()
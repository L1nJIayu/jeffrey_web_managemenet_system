const User = require('../model/user.model')

class UserService {
  async createUser(params) {
    try {
      const {
        user_name,
        password,
        nick_name
      } = params

      await User.create({
        user_name,
        password,
        nick_name
      })

      return Promise.resolve('用户添加成功！')
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async modifyUser(params) {
    User.update()
  }
}

module.exports = new UserService()
const ajv = require('./ajv')

const loginSchema = {
  type: "object",
  properties: {
    user_name: {
      type: 'string',
      errorMessage: {
        required: '用户名不能为空'
      }
    },
    password: {type: "string"},
  },
  required: ['user_name', 'password'],
  additionalProperties: false,
  

}


module.exports = {
  loginValidator: ajv.compile(loginSchema)
}
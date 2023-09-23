



module.exports = {
  paramsFormatError: {
    code: '4000',
    message: '接口参数格式错误'
  },
  serviceError: {
    code: '5000',
    message: '服务器错误，请联系管理员'
  },
  userRegisterError: {
    code: '4001002',
    message: '用户注册失败'
  },
  userAlreadyExisted: {
    code: '4001001',
    message: '用户名已存在'
  },
  loginUserNameOrPasswordError: {
    code: '4001003',
    message: '用户名密码错误'
  },
  loginUserNameOrPasswordNullError: {
    code: '4001004',
    message: '用户名密码不能为空'
  },
  invalidToken: {
    code: '4001005',
    message: '未登录'
  },
  tokenExpired: {
    code: '4001006',
    message: '登录超时，请重新登录'
  },
  userNotFoundError: {
    code: '4001007',
    message: '用户不存在'
  },
  userLoginError: {
    code: '5001001',
    message: '登录失败'
  }
}
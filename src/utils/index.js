
const getResponseBody = (opts) => {
  const {
    code=-1,
    message='',
    result=null
  } = opts

  return { code, message, result }
}

module.exports = {
  getResponseBody
}
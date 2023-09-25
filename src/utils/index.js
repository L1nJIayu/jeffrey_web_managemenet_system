
const getResponseBody = (opts) => {
  const {
    code,
    message,
    result
  } = opts

  return { code, message, result }
}

module.exports = {
  getResponseBody
}
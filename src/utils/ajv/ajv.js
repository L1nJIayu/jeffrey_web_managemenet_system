const Ajv = require('ajv')
const ajvErrors = require('ajv-errors')


const ajv = ajvErrors(new Ajv({
  allErrors: true
}))

module.exports = ajv
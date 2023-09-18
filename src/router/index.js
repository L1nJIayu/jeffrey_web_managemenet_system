const fs = require('fs')
const Router = require('@koa/router')

const router = new Router()

const fileList = fs.readdirSync(__dirname)
fileList.forEach(filename => {
  if(filename !== 'index.js') {
    router.use(require(`./${ filename }`))
  }
})


module.exports = router.routes()
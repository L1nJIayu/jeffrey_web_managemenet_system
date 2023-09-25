const KoaRouter = require('@koa/router')


const { uploadFile } = require('../controller/file.controller')

const router = new KoaRouter({
  prefix: '/file'
})

router.post('/uploadImg', uploadFile)


module.exports = router.routes()


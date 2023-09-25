const KoaRouter = require('@koa/router')

const { uploadFile } = require('../controller/file.controller')
const { auth } = require('../middleware/auth.middleware')
const { imgMimeTypeValidator } = require('../middleware/file.middleware')

const router = new KoaRouter({
  prefix: '/file'
})

router.post('/uploadImg', auth, imgMimeTypeValidator, uploadFile)

module.exports = router.routes()


const Koa = require('koa')
const { koaBody } = require('koa-body')

const routes = require('../router')	// 只需要引入一个模块即可
const errorHandler = require('./errorHandler')
const successHandler = require('./successHandler')

const app = new Koa()

app.use(koaBody())	// 注册koa-body中间件
app.use(routes)	    // 一次性全部导入

app.on('error', errorHandler) // 错误处理
app.on('success', successHandler)

module.exports = app
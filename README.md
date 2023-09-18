# 后台管理系统-开发记录



## 一、基本项目搭建

### 依赖、项目搭建

1. 安装依赖
```shell
  pnpm init
  pnpm i koa dotenv nodemon
```
2. 配置脚本

`package.json`

```json
"scripts": {
    "dev": "nodemon ./src/main.js"
}
```
3. 运行
```shell
pnpm run dev
```

### 环境配置

`./src/config/default.config.js`

```js
const dotenv = require('dotenv')
dotenv.config()	// 执行后会自动找到项目根目录的.env文件加载，把配置项全部写入process.env中

module.exports = process.env	// 导出配置，方便使用时直接解构获取配置
```

### 项目初始化

```js
const Koa = require('koa')

const { SERVER_PORT } = require('./config/config.default')
const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Hello,Koa2.'
})
app.listen(SERVER_PORT, () => {
  console.log(`server is running on: http://localhost:${ SERVER_PORT }`)
})
```

### 效果

![image-20230914112454559](README.assets/image-20230914112454559.png)

![image-20230914112549623](README.assets/image-20230914112549623.png)

### 优化

对于整个项目来说，`Koa`属于第三方工具，可以把`Koa`相关的代码单独抽离出来，`main.js`只需要做引用配置，获取应用实例，监听端口等操作即可。这样做可以让代码结构，分工更加清晰。

后续再有其他的功能引入，均在`./src/app/index.js`编写实现。

`./src/app/index.js`

```js
const Koa = require('koa')
const app = new Koa()

module.exports = app
```

`./src/main.js`

```js
const app = require('./app')
const { SERVER_PORT } = require('./config/config.default')

app.listen(SERVER_PORT, () => {
  console.log(`server is running on: http://localhost:${ SERVER_PORT }`)
})
```

现在可能感受还不太深，在下一章引入`@koa/router`后，感受可能会加深！



## 二、路由配置

### 依赖安装

```shell
pnpm i @koa/router
```

### 路由编写

`./src/router/index.route.js`

```js
const Router = require('@koa/router')

const router = new Router()

router.get('/', (ctx, next) => {
    ctx.body = 'Hello Koa2!!'
})

module.exports = router.routes()	// 返回一个函数，此函数可作为中间件
```

`./src/router/user.route.js`

```js
const Router = require('@koa/router')

const router = new Router({
    prefix: '/user'	// 定义此路由的前缀
})

router.get('/', (ctx, next) => {
    ctx.body = [
        { id: 1, name: 'jeffrey', age: 27 }
    ]
})

module.exports = router.routes()
```

`./src/app/index.js`

```js
const Koa = require('koa')

const indexRoute = require('../router/index.route.js')
const userRoute = require('../router/user.route.js')

const app = new Koa()

app.use(indexRoute)
app.use(userRoute)

module.exports = app
```



### 效果

![image-20230914121119301](README.assets/image-20230914121119301.png)

<div align="center">index路由</div>

![image-20230914121131137](README.assets/image-20230914121131137.png)

<div align="center">user路由</div>

### 优化

可以看到每次定义新的路由块，都需要引入新的模块，并用`app.use(xxxRoute)`来执行，这个动作其实是可以自动完成的。

`./src/router/index.js`

```js
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
```

`./src/app/index.js`

```js
const Koa = require('koa')
const routes = require('./router')	// 只需要引入一个模块即可

const app = new Koa()

app.use(routes)	// 一次性全部导入

module.exports = app
```



## 三、控制器 Controller

`router`应该是只用来管理路由，里面具体的实现逻辑，应该单独抽离出来，代码才能更清晰。对于逻辑控制这一层，我们都放在`controller`中进行管理。

`./src/controller/user.controller.js`

```js
class UserController {
    login(ctx, next) {
        ctx.body = {
            code: 2000,
            data: null,
            message: '登录成功！'
        }
    }
    register(ctx, next) {
        ctx.body = {
            code: 2000,
            data: null,
            message: '注册成功！'
        }
    }
}

module.exports = new UserController()	// 暴露出去的应该是一个实例，使用时可直接结构获取里面的函数
```

`./src/router/user.route.js`

```js
const Router = require('@koa/router')

const { login, register } = require('../controller/user.controller.js')	// 引用时直接解构获取处理函数

const router = new Router({
    prefix: '/user'
})

/* 不写逻辑，只写路由 */
router.post('/login', login)
router.post('/register', register)

module.exports = router.routes()
```



### 补充内容：解析post请求中的请求体body

1. 依赖下载

   ```shell
   pnpm i koa-body
   ```

2. 注册中间件

   `./src/app/index.js`

   ```js
   const Koa = require('koa')
   const { koaBody } = require('koa-body')
   const routes = require('../router')
   
   const app = new Koa()
   
   app.use(koaBody())	// 注册koa-body中间件
   app.use(routes)
   
   module.exports = app
   ```

3. 在`ctx.request.body`中获取请求体数据

   `./src/controller/user.controller.js`

   ```js
   class UserController {
       register(ctx, next) {
           console.log(ctx.request.body)	// 从ctx.request.body中获取请求体数据
           ctx.body = {
               code: 2000,
               data: ctx.request.body,
               message: '注册成功'
           }
       }
   }
   module.exports = new UserController()
   ```

4. 效果

   ![](README.assets/image-20230914171703565.png)



## 四、服务层 Service

在`controller`中应该是针对业务的具体逻辑进行处理，对于`数据`的具体操作（即操作`数据库`），应该单独抽离出来处理，我们统一放在`service`中进行处理。

`./src/service/user.service.js`

```js
class UserService {
    async createUser(params) {
        try {
            const {
                username,
                password
            } = params
            
            return Promise.resolve('用户添加成功！')
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

module.exports = new UserService()
```

`./src/controller/user.controller.js`

```js
const { createUser } = require('../service/user.service.js')
class UserController {
    async register(ctx, next) {
        try {
            await createUser(ctx.request.body)
            ctx.body = {
                code: 2000,
                data: ctx.request.body,
                message: '恭喜！用户注册成功！'
            }
        } catch (err) {
            console.error(err)
            ctx.body = {
                code: 5000,
                data: null,
                message: '用户注册失败' + err
            }
        }
    }
}

module.exports = new UserController()
```

![](README.assets/image-20230914173704340.png)

<div align="center">效果-注册成功</div>

![image-20230914173809994](README.assets/image-20230914173809994.png)

<div align="center">效果-注册失败</div>

## 五、数据库

### 依赖安装

```shell
pnpm i sequelize mariadb
```










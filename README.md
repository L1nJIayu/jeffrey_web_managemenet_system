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

`.env`

```
SERVER_PORT=21213	# 服务端口
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

### 连接数据库

要连接到数据库，必须创建一个`Sequelize`实例

`./src/db/seq.js`

```js
const { Sequelize } = require('sequelize')

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PWD,
  DB_DIALECT,
} = require('../config/default.config')

const seq = new Sequelize({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PWD,
  dialect: DB_DIALECT
})

// 测试连接
testConnectDatabase()
async function testConnectDatabase() {
  try {
    await seq.authenticate()
    console.log('数据库连接成功！')
  } catch (err) {
    console.error('数据库连接失败！', err)
  }
}

module.exports = seq
```

`.env`

```
# 服务端口
SERVER_PORT=21213

# 数据库配置信息
DB_HOST=192.168.0.111
DB_PORT=3306
DB_DATABASE=my_db
DB_USERNAME=root
DB_PWD=123456
DB_DIALECT=mariadb
```

使用`seq.authenticate()`可测试数据库是否连接成功，它会返回一个Promise。

## 六、模型 Model

`模型`与`数据表`对应，例如我们有一张用户表`t_user`，即可对应创建一个用户模型`User`，在模型中定义每个字段的类型、约束等信息。

在`sequelize`中，定义模型有两种方法：

- 调用`sequelize.define(modelName, attributes, options)`
- 扩展`Model`并调用`init(attributes, options)`

### 定义

`./src/model/user.model.js`

```js
const seq = require('../db/seq')
const { DataTypes } = require('sequelize')

// define函数的第一个参数是模型名称的定义
// 如果没用在options中定义表名，则会根据模型名称生成对应的复数形式作为表名。
const User = seq.define('user', {
  user_name: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.CHAR(255),
    allowNull: false,
    comment: '密码'
  },
  nick_name: {
    type: DataTypes.CHAR(64),
    comment: '昵称'
  },
  is_deleted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '是否被删除: 0:未删除 1:已删除'
  },
}, {
    tableName: 't_user'	// 定义表明
})

// 同步数据表
User.sync({
    alert: true
})

module.exports = User
```

调用`User.sync()`后，`数据库`就会生成与`模型`对应的`数据表`，如果没用做其他定义，会自动补充`id`、`createAt`、`updateAt`三个字段。



### 使用

有了模型以后，我们就可以在`service`层开始操作数据库了

#### 1.创建

`./src/service/user.service.js`

```js
const User = require('../model/user.model')

class UserService {
    async createUser(params) {
        const user = await User.create(params)
        console.log(JSON.stringify(user, null, 4))
        return user
    }
}

module.exports = new UserService()
```

> `Model.create()`方法是使用`Model.build()`构建未保存实例，并使用`Model.save()`保存实例的简写形式.
>
> ```js
> const user = User.build({ name: "Jeffrey" });
> await user.save();
> ```

#### 2.其他操作

关于其他操作，具体可直接看[官方文档](https://www.sequelize.cn/core-concepts/model-querying-basics)。



## 七、中间件

​	在控制层`controller`中，可以添加一些请求验证的逻辑，例如`用户注册`，需要在调用`service`之前，先对用户请求的参数做验证，判断其是否为空、用户名是否已存在等。

​	但如果把这些验证逻辑全部写在`controller`中，代码会显得很繁杂，最好的办法就是用`中间件`,在调用`controller`之前，先调用`中间件`，确保验证通过了之后才调用`controller`。

`./src/middleware/user.middleware.js`

```js
const userRegisterValidator = async (ctx, next) => {
    const { user_name, password } = ctx.request.body
    
    if(!user_name || !password) {
        ctx.body = {
            code: '4000',
            message: '用户名或密码为空',
            result: null
        }
        return
    }
    
    await next()
}

module.exports = {
    userRegisterValidator
}
```

`./src/router/user.route.js`

```js
const Router = require('@koa/router')

const { register } = require('../controller/user.controller.js')
const { userRegisterValidator } = require('../middleware/user.middleware')

const router = new Router({
  prefix: '/user'
})

// 在调用register之前，先调用userRegisterValidator
router.post('/register', userRegisterValidator, register)


module.exports = router.routes()
```



## 八、统一的错误处理函数

​	为了提高代码的健壮性，除了编辑业务本身的处理逻辑以外，还应该在外层嵌套`try..catch`，以保证出现错误时及时错误对应的处理动作。

​	使用`app.on`来监听错误事件，当我们`catch`到错误时，调用`ctx.app.emit`来触发错误事件。

`./src/controller/user.controller.js`

```js
const UserService = require('../service/user.service')
const { Service_Error } = require('../constants/error.type')

class UserController {
    async register(ctx, next) {
        try {
            const result = await UserService.createUser(ctx.request.body)
            ctx.body = {
                code: '2000',
                result,
                message: '恭喜！用户注册成功'
            }
        } catch (error) {
            // 在catch中触发`error`事件
            ctx.app.emit('error', {
                errorObj: getErrorObj(Service_Error),
                ctx,
                error
            })
        }
    }
}
```

`./src/app/index.js`

```js
const Koa = require('koa')
const { koaBody } = require('koa-body')

const routes = require('../router')
const errorHandler = require('./errorHandler')

const app = new Koa()

app.use(koaBody())
app.use(routes)

app.on('error', errorHandler) // 错误处理

module.exports = app
```

`./src/app/errorHandler.js`

```js
module.exports = (opts) => {

  const {
    responseBody,
    ctx,
    error
  } = opts
  try {
  
    let status = 500
    switch (responseBody.code) {
      case '4000':
        status = 400
        break;
      case '5000':
        status = 400
        break;
      default:
        status = 500
        break;
    }
    ctx.status = status
    ctx.body = responseBody
    console.error('捕获到错误信息：', error)

  } catch (err) {
    console.error(opts)
    console.error('错误处理函数出错：', err)
  }
}
```



## 九、加密


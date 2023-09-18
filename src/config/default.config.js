const dotenv = require('dotenv')
dotenv.config()	// 执行后会自动找到项目根目录的.env文件加载，把配置项全部写入process.env中

module.exports = process.env	// 导出配置，方便使用时直接解构获取配置
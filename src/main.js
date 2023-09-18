const app = require('./app')
const { SERVER_PORT } = require('./config/default.config')

app.listen(SERVER_PORT, () => {
  console.log(`server is running on: http://localhost:${ SERVER_PORT }`)
})
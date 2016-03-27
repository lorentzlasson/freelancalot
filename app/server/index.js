let express = require('express')
let server = express()
let path = require('path')
let bodyParser = require('body-parser')
server.use(bodyParser.json())

let routes = require('./routes')
let apiRouter = express.Router()
apiRouter.use('/user', routes.user)
server.use('/api', apiRouter)

let publicPath = path.join(__dirname, '../public')
server.use('/', express.static(publicPath))

module.exports = server

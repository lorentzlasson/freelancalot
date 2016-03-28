const express = require('express')
const server = express()
const path = require('path')
const bodyParser = require('body-parser')
server.use(bodyParser.json())

const routes = require('./routes')
const apiRouter = express.Router()
apiRouter.use('/user', routes.user)
server.use('/api', apiRouter)

const publicPath = path.join(__dirname, '../public')
server.use('/', express.static(publicPath))

module.exports = server

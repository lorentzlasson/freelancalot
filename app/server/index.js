const express = require('express')
const server = express()
const path = require('path')
const bodyParser = require('body-parser')
const auth = require('./auth')
const errorHandler = require('./error-handler')
server.use(bodyParser.json())

const routes = require('./routes')
const apiRouter = express.Router()
apiRouter.use('/user', routes.user)
apiRouter.use('/hub', auth.ensure, routes.hub)
apiRouter.use('/', errorHandler)
server.use('/api', apiRouter)

const publicPath = path.join(__dirname, '../public')
server.use('/', express.static(publicPath))

module.exports = server

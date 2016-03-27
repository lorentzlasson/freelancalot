let router = require('express').Router()
let jwt = require('jsonwebtoken')
let validator = require('validator')
let auth = require('../auth')

let User
require('../../database')
.then(db => {
	User = db.model.user
})

router.get('/hello', auth.ensure, (req, res) => {
	res.json({message: 'world'})
})

router.get('/me', auth.ensure, (req, res) => {
	let email = req.decoded.email
	User.findOne({
		where: {
			email: email
		}
	}).then(user => {
		if (!user) {
			return res.status(500).end()
		}
		return res.json(user)
	})
})

router.get('/me/photo', auth.ensure, (req, res) => {
	res.status(501).json({photo: 'dummy photo'})
})

// --------- PUBLIC PATHS -----------
// register new user
router.post('/', (req, res) => {
	let credentials = req.body
	if (!validator.isEmail(credentials.username)) {
		return res.status(400).json({error: 'username is not a valid email address'})
	}
	User.findOrCreate({
		where: {
			email: credentials.username
		},
		defaults: {
			password: credentials.password
		}
	})
	.spread((user, created) => {
		if (!created) {
			return res.status(409).json({error: 'username taken'})
		}

		return res.json(user)
	})
})

router.post('/login', (req, res) => {
	let credentials = req.body,
		username = credentials.username,
		password = credentials.password

	User.findOne({
		where: {
			email: username
		}
	}).then(user => {
		if (!user) {
			return res.status(401).json({error: 'username does not exist'})
		}

		if (!user.validPassword(password)) {
			return res.status(401).json({error: 'incorrect password'})
		}

		if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
		let token = jwt.sign({email: user.email}, process.env.JWT_SECRET)

		return res.json({token})

	}, err => {
		return res.status(500).send(err)
	})
})

module.exports = router

const router = require('express').Router()
const jwt = require('jsonwebtoken')
const auth = require('../auth')
const handleError = require('../error-handler')
const mail = require('../../util/mail')
const uuid = require('node-uuid')

let User
require('../../database')
.then(db => {
	User = db.model.user
})

router.get('/me', auth.ensure, (req, res) => {
	const email = req.decoded.email
	User.findOne({
		where: {
			email: email
		}
	})
	.then(user => {
		if (!user) {
			return res.status(500).end()
		}
		return res.json(user)
	})
	.catch(err => {
		const error = handleError(err)
		return res.status(error.status).json(error.message)
	})
})

router.get('/me/photo', auth.ensure, (req, res) => {
	res.status(501).json({photo: 'dummy photo'})
})

// --------- PUBLIC PATHS -----------
// register new user
router.post('/', (req, res) => {
	const creds = req.body
	const user = {
		email: creds.username,
		password: creds.password,
		verifiedEmail: false,
		emailToken: uuid.v4(),
		emailTokenExpires: new Date().setDate(new Date().getDate() + 1)
	}

	User.create(user)
	.then((user) => {
		return mail.sendVerification(user)
	})
	.then(() => {
		if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
		const token = jwt.sign({email: user.email}, process.env.JWT_SECRET)
		return res.json({token})
	})
	.catch(err => {
		const error = handleError(err)
		return res.status(error.status).json(error.message)
	})
})

router.get('/confirm/:token', (req, res) => {
	const token = req.params.token

	User.findOne({
		where: {
			emailToken: token
		}
	})
	.then(user => {
		if (!user){
			return res.status(401).send('no user associated with verification')
		}

		const expires = new Date(user.emailTokenExpires)
		const now = new Date()

		if (now > expires){
			return res.status(410).send('this link has expired, request a new link <a href="http://localhost:6001/refresh-verification">here</a>')
		}

		return User.update({
			verifiedEmail: true,
			emailToken: null,
			emailTokenExpires: null
		}, {
			where: { id: user.id }
		})
	})
	.then(() => {
		return res.status(200).send('thank you for verifying')
	})
	.catch(err => {
		const error = handleError(err)
		return res.status(error.status).json(error.message)
	})
})

router.post('/login', (req, res) => {
	const credentials = req.body,
		username = credentials.username,
		password = credentials.password

	User.findOne({
		where: {
			email: username
		}
	})
	.then(user => {
		if (!user) {
			return res.status(401).json({error: 'username does not exist'})
		}

		if (!user.validPassword(password)) {
			return res.status(401).json({error: 'incorrect password'})
		}

		if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
		const token = jwt.sign({email: user.email}, process.env.JWT_SECRET)

		return res.json({token})
	})
	.catch(err => {
		const error = handleError(err)
		return res.status(error.status).json(error.message)
	})
})

module.exports = router

var jwt = require('jsonwebtoken')
var validator = require('validator')

module.exports = (app, User) => {

	// ----- Local -----
	app.post('/register', (req, res) => {
		var credentials = req.body
		if (!validator.isEmail(credentials.username)) {
			return res.status(400).send('username is not a valid email address')
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
				return res.status(400).send('username taken')
			}

			return res.end()
		})
	})

	app.post('/login', (req, res) => {
		var credentials = req.body,
			username = credentials.username,
			password = credentials.password

		User.findOne({
			where: {
				email: username
			}
		}).then((user) => {
			if (!user) {
				return res.status(401).send('username does not exist')
			}

			if (!user.validPassword(password)) {
				return res.status(401).send('incorrect password')
			}

			var token = jwt.sign(user.email, process.env.JWT_SECRET, {
				expiresInMinutes: 1440
			})

			return res.send({
				token: token
			})

		}, (err) => {
			console.err(err)
			return res.sendStatus(500)
		})
	})
}
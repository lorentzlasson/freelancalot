const jwt = require('jsonwebtoken')

const ensure = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token']

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).send('failed to authenticate token')
			}

			req.decoded = decoded
			return next()
		})

	} else {
		return res.status(401).send('no token provided')
	}
}

module.exports = {
	ensure
}

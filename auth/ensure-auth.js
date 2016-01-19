var jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
	var token = req.body.token || req.query.token || req.headers['x-access-token']

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
			if (err) {
				return res.status(403).send('failed to authenticate token')
			} else {
				req.decoded = decoded
				next()
			}
		})

	} else {
		return res.status(403).send('no token provided')
	}
}

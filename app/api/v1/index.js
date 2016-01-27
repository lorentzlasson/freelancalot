var express = require('express'),
	router = express.Router(),
	orm = require('../../orm'),
	User = orm.model('user')

router.get('/hello', (req, res) => {
	res.send('world v1')
})

router.get('/user', (req, res) => {
	var email = req.decoded
	User.findOne({
		where: {
			email: email
		}
	}).then((user) => {
		if (!user) {
			return res.status(500).end()
		}
		return res.send(user)
	})
})

router.get('/user/photo', (req, res) => {
	res.status(501).send('dummy photo')
})

module.exports = router

const router = require('express').Router()

let Hub
require('../../database')
.then(db => {
	Hub = db.model.hub
})

router.get('/', (req, res) => {
	Hub.findAll().then(hubs => {
		return res.json(hubs)
	})
})

router.post('/', (req, res) => {
	const hub = req.body

	Hub.create(hub).then(newHub => {
		return res.json(newHub)
	})
})

module.exports = router

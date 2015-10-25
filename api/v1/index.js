var express = require('express'),
    router = express.Router();

router.get('/hello', (req, res) => {
    res.send('world v1');
});

router.get('/user', (req, res) => {
	var user = req.user;
    res.send(user);
});

module.exports = router;

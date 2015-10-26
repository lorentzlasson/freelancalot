var express = require('express'),
    router = express.Router();

router.get('/hello', (req, res) => {
    res.send('world v1');
});

router.get('/user', (req, res) => {
	var user = req.user;
    res.send(user);
});

router.get('/user/photo', (req, res) => {
	var user = req.user;
	var photo = user.get('photo');
    res.send(photo);
});

module.exports = router;

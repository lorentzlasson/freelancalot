var express = require('express'),
    router = express.Router();

router.get('/hello', (req, res) => {
    res.send('world v1');
});

module.exports = router;

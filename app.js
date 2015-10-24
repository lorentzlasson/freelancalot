var express = require('express'),
    app = express();
var util = ('util');

var isLocal = !process.env.VCAP_APPLICATION;
var host = (process.env.VCAP_APP_HOST || "localhost");
var port = (process.env.VCAP_APP_PORT || 3000);

var v1router = require('./api/v1');
app.use('/api/v1/', v1router); 

console.log('Running on %s:%d', host, port);
app.listen(port, host);

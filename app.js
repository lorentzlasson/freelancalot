var express = require('express'),
    app = express();
var util = ('util');
var orm = require('./model');
var cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv();

var isLocal = !process.env.VCAP_APPLICATION;
var host = (process.env.VCAP_APP_HOST || "localhost");
var port = (process.env.VCAP_APP_PORT || 3000);

var dbService = appEnv.getService('myClearDB'),
    dbCreds = dbService.credentials;

orm.setup("./models", dbCreds.name, dbCreds.username, dbCreds.password, {
    host: dbCreds.hostname,
    dialect: 'mysql',
    port: dbCreds.port
});

var User = orm.model("user");

var v1router = require('./api/v1');
app.use('/api/v1/', v1router);

console.log('Running on %s:%d', host, port);
app.listen(port, host);

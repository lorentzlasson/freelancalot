var express = require('express'),
    app = express();
var util = require('util');
var orm = require('./model');
var cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var isLocal = !process.env.VCAP_APPLICATION;
var host = (process.env.VCAP_APP_HOST || "localhost");
var port = (process.env.VCAP_APP_PORT || 3000);
var url = isLocal ? util.format("%s:%d", host, port) : appEnv.app.uris[0];

var dbService = appEnv.getService('myClearDB'),
    dbCreds = dbService.credentials;

orm.setup("./models", dbCreds.name, dbCreds.username, dbCreds.password, {
    host: dbCreds.hostname,
    dialect: 'mysql',
    port: dbCreds.port,
    pool: {
        max: 2
    }
});

var User = orm.model("user");

require('./auth')(app, url, appEnv, User)

var ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(403);
}

app.use('/', express.static(__dirname + '/public'));
var v1router = require('./api/v1');
app.use('/api/v1/', ensureAuthenticated, v1router);

console.log('Running on %s:%d', host, port);
app.listen(port, host);
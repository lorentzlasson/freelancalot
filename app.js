var express = require('express'),
    app = express();
var util = require('util');
var orm = require('./model');
var cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv();
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'freelancalot',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var isLocal = !process.env.VCAP_APPLICATION;
var host = (process.env.VCAP_APP_HOST || "localhost");
var port = (process.env.VCAP_APP_PORT || 3000);
var url = isLocal ? util.format("%s:%d", host, port) : appEnv.app.uris[0];

passport.serializeUser(function(user, done) {
    var id = user.get('id');
    console.log('serializeUser: ' + id)
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        done(null, user);
    })
});

var googleOAuth = appEnv.getService('googleOAuth'),
    googleOAuthCreds = googleOAuth.credentials;

passport.use(new GoogleStrategy({
        clientID: googleOAuthCreds.clientID,
        clientSecret: googleOAuthCreds.clientSecret,
        callbackURL: util.format("http://%s%s", url, googleOAuthCreds.callbackPath)
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOrCreate({
                    where: {
                        googleId: profile.id
                    },
                    defaults: {
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                })
                .spread(function(user, created) {
                    done(null, user);
                })
        });
    }));

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

var dbService = appEnv.getService('myClearDB'),
    dbCreds = dbService.credentials;

orm.setup("./models", dbCreds.name, dbCreds.username, dbCreds.password, {
    host: dbCreds.hostname,
    dialect: 'mysql',
    port: dbCreds.port
});

var User = orm.model("user");

var ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send("not logged in");
}

app.use('/', express.static(__dirname + '/public'));
app.all('/api/v1/*', ensureAuthenticated);
var v1router = require('./api/v1');
app.use('/api/v1/', v1router);

console.log('Running on %s:%d', host, port);
app.listen(port, host);

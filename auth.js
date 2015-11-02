var util = require('util');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');

module.exports = (app, url, appEnv, User) => {

    app.use(session({
        secret: process.env.SESSION_SECRET,
        name: 'freelancalot',
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        var id = user.get('id');
        console.log('serializeUser: ' + id)
        done(null, id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        })
    });

    // ----- Google -----
    var googleOAuth = appEnv.getService('googleOAuth'),
        googleOAuthCreds = googleOAuth.credentials;

    passport.use(new GoogleStrategy({
            clientID: googleOAuthCreds.clientID,
            clientSecret: googleOAuthCreds.clientSecret,
            callbackURL: util.format("http://%s%s", url, googleOAuthCreds.callbackPath)
        },
        (token, refreshToken, profile, done) => {
            process.nextTick(() => {
                User.findOrCreate({
                        where: {
                            googleId: profile.id
                        },
                        defaults: {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            photo: profile.photos[0].value
                        }
                    })
                    .spread((user, created) => {
                        done(null, user);
                    })
            });
        }));

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/'
        }));

    // ----- Local -----
    var getUser = (req, res) => {
        var user = req.user;
        if (user) {
            return res.send({
                id: user.id,
                permission: user.permission
            });
        };
        res.end();
    }

    app.post('/register', (req, res, next) => {
        var credentials = req.body;
        if (!validator.isEmail(credentials.username)) {
            return res.status(400).send({
                message: 'Username is not a valid email'
            })
        }
        User.findOrCreate({
                where: {
                    email: credentials.username
                },
                defaults: {
                    password: credentials.password
                }
            })
            .spread((user, created) => {
                if (!created) {
                    return res.status(400).send({
                        message: 'Username taken'
                    });
                };
                req.login(user, (err) => {
                    if (err) {
                        return res.status(400).send({
                            message: 'User created but could not log in',
                            err: err
                        });
                    };
                    return next();
                })
            })
    }, getUser);

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        (req, username, password, done) => {
            User.findOne({
                where: {
                    email: username
                }
            }).then((user) => {
                if (!user) {
                    return done(null, false, { message: 'Invalid user' });
                }

                if(!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);

            }, (error) => {
                return done(error, null);
            })
        }));

    app.post('/login', passport.authenticate('login'), getUser);

    app.get('/user', getUser);

    // ----- Other -----
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}
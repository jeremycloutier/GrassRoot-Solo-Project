var express = require('express');
var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var register = require('./routes/register');
var event = require('./routes/event');
var eventsubmit = require('./routes/eventsubmit');

var app = express();

var localStrategy = require('passport-local').Strategy;

var connectionString = 'postgres://szbjbbxnkpxici:uzXyuzPfJJlCM20qBePl-I8Oky@ec2-54-83-56-31.compute-1.amazonaws.com:5432/d2m4f6d1ii5dtn';

app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

pg.defaults.ssl = true;
pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    client
        .query('SELECT table_schema,table_name FROM information_schema.tables;')
        .on('row', function(row) {
            console.log(JSON.stringify(row));
        });
});
//[][][][][][][][][][][][][][][][][][][][][][][][][][]
//                  PASSPORT THINGS                 //
//[][][][][][][][][][][][][][][][][][][][][][][][][][]
app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/register', register);
app.use('/event', event);
app.use('/eventsubmit', eventsubmit);
app.use('/', index);

passport.serializeUser(function(user, done){
    console.log('serializeUser', user);
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done){
    console.log('deserializeUser', id);
    pg.connect(connectionString, function(err, client){
        var user = {};

        var query = client.query('SELECT * FROM users WHERE user_id = $1', [id]);

        query.on('row', function(row){
            user = row;
            console.log('User object', user);
            done(null, user);
        });
    });
});

// Note: Passport stores user session information in req.user.  Use req.user.id for id, etc.
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField:'username'
}, function(req, username, password, done){
    console.log('called');
    pg.connect(connectionString, function(err, client){
        var databaseUser = {};

        var query = client.query('SELECT * FROM users WHERE email = $1', [username]);

        query.on('row', function(row){
            databaseUser = row;
            console.log('User object:', databaseUser);
        });

        query.on('end', function(){
            if(databaseUser && databaseUser.email_password === password){
                console.log('matched');
                done(null, databaseUser);
            } else {
                console.log('didn\'t match');

                done(null, false, {message: 'Wrong username or password'});
            }
        });
    });
}));

app.set("port", process.env.PORT || 3000);

var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log("Listening on port" + app.get('port'));
});
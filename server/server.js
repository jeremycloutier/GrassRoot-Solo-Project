var express = require('express');
var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var register = require('./routes/register');

var app = express();

var localStrategy = require('passport-local').Strategy;

var connectionString = 'postgres://localhost:5432/grassroot_project_db';

app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//[][][][][][][][][][][][][][][][][][][][][][][][][][]
//                  PASSPORT THINGS                 // Need to replace "id" with "user_id", replace "username" with "email".
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
app.use('/', index);
app.use('/register', register);

passport.serializeUser(function(user, done){
    console.log('serializeUser', user);
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done){
    console.log('deserializeUser', id);
    pg.connect(connectionString, function(err, client){
        var user = {};

        var query = client.query('SELECT * FROM users WHERE user_id = $1', [id]);    // This is an example query.

        query.on('row', function(row){
            user = row;
            console.log('User object', user);
            done(null, user);
        });
    });
});

passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField:'username'
}, function(req, username, password, done){
    console.log('called');
    pg.connect(connectionString, function(err, client){ // DO NOT use 'done' here or it will fail silently and be very hard to find
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

var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Listening on port', port);
});
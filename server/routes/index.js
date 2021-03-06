var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/success', function(request, response){
    response.send('home');
});

router.get('/failure', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/event', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/event.html'));
});

router.get('/logout', function(request, response){
    console.log('logout router hit');
    request.logout();
    response.redirect('/');
});

router.get('/*', function(request, response){
    response.redirect('/');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect:'/failure'
}));

module.exports = router;
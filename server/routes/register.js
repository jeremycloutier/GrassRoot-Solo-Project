var express = require('express');
var path = require('path');
var pg = require('pg');
var router = express.Router();

var connectionString = 'postgres://szbjbbxnkpxici:uzXyuzPfJJlCM20qBePl-I8Oky@ec2-54-83-56-31.compute-1.amazonaws.com:5432/d2m4f6d1ii5dtn';

//GET route to register.html
router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

//Creates a user and routes the user information.
router.post('/', function(req,res,next) {
    console.log(req.body);

    var user = req.body;

    pg.connect(connectionString, function(err, client){
        var query = client.query('INSERT INTO users (last_name, first_name, email, email_password, membership_type) VALUES ($1, $2, $3, $4, $5)', [user.lastname, user.firstname, user.email, user.password, 'Citizen']);

        query.on('error', function(error){
            console.log(error);
            res.sendStatus(500);
        });

        query.on('end', function(){
            //res.sendStatus(200);
            res.sendFile(path.join(__dirname, '../public/views/regsuccess.html'));
        });
    });

});

module.exports = router;
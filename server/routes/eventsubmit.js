var express = require('express');
var path = require('path');
var pg = require('pg');
var router = express.Router();

var connectionString = 'postgres://szbjbbxnkpxici:uzXyuzPfJJlCM20qBePl-I8Oky@ec2-54-83-56-31.compute-1.amazonaws.com:5432/d2m4f6d1ii5dtn';

//GET route to user.html
router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname, '../public/views/user.html'));
});

//Creates an event and routes the event information.
router.post('/', function(req,res,next) {
    console.log(req.body);
    var event = req.body;

    pg.connect(connectionString, function(err, client){
        var query = client.query('INSERT INTO events(title, host, date, street_address, city, state, zip, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [event.title, event.host, event.date, event.address, event.city, event.state, event.zip, event.description]);

        query.on('error', function(error){
            console.log(error);
            res.sendStatus(500);
        });

        query.on('end', function(){
            res.sendFile(path.join(__dirname, '../public/views/success.html'));
        });
    });
});

module.exports = router;
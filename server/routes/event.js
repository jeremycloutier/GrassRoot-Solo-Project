var express = require('express');
var path = require('path');
var pg = require('pg');
var router = express.Router();

var connectionString = 'postgres://szbjbbxnkpxici:uzXyuzPfJJlCM20qBePl-I8Oky@ec2-54-83-56-31.compute-1.amazonaws.com:5432/d2m4f6d1ii5dtn';

router.get('/:state', function(req, res, next){
    console.log(req.params.state);

    var reqState = req.params.state;

    var results = [];

    pg.connect(connectionString, function(err, client){
        var query = client.query('SELECT * FROM events WHERE STATE = $1', [reqState]);

        query.on('error', function(error){
            console.log(error);
            res.sendStatus(500);
        });

        query.on('row', function(row){
            console.log(row);
            results.push(row);
            //res.sendStatus(500);
        });

        query.on('end', function(){
            client.end(); //this will change once we do our 2nd query for user name
            res.send(results);
        });
    });
});

router.get('/info/:id', function(req, res, next){
    console.log(req.params.id);
    var reqId = req.params.id;
    var results = [];

    pg.connect(connectionString, function(err, client){
        var query = client.query('SELECT * FROM events WHERE id = $1', [reqId]);

        query.on('error', function(error){
            console.log(error);
            res.sendStatus(500);
        });

        query.on('row', function(row){
            console.log(row);
            results.push(row);
            //res.sendStatus(500);
        });

        query.on('end', function(){
            client.end();
            //return res.json(results);
            res.send(results);
        });
    });
});

module.exports = router;
var express = require('express');
var path = require('path');
var pg = require('pg');
var router = express.Router();

var connectionString = 'postgres://localhost:5432/grassroot_project_db';

router.get('/:state', function(req, res, next){
    console.log('hit endpoint');
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

module.exports = router;
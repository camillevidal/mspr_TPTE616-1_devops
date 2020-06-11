const express = require('express');
const commons = require('./commons');
var mysql = require('mysql');
const router = express.Router();
let co_insert = mysql.createConnection({
    host        : '109.11.21.53',
    port        :'3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

let co_update = mysql.createConnection({
    host        : '109.11.21.53',
    port        :'3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

router.get('/token/:id', (req, res) => {
    //insert user in DB
    let sql_insert = 'Select id from Connection WHERE token =' +'"' + req.params.id +'"';
    let sql_update = 'UPDATE Connection Set token = null WHERE token =' +'"' + req.params.id +'"';
    console.log(sql_insert)
    console.log(sql_update)

    // execute the insert statment
    co_insert.query(sql_insert, function (err, result, fields) {
        if (err) throw err;
        else {
            console.log(result.length)
            if (result.length ===  1) {
                co_update.query(sql_update, function (err_bis, result_bis, fields_bis) {
                    if (err) throw err;
                    else {
                        console.log("update");
                    }
                });
            }

        }
    });

    return res.send({
        "status": 200,
        "message": "User is successfully registered"
    });
});

module.exports = router;
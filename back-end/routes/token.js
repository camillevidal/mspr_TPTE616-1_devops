const express = require('express');
const commons = require('./commons');
var mysql = require('mysql');
const router = express.Router();
let co_insert = mysql.createConnection({
    host        : 'portail.chatelet.dutmen.fr',
    port        : '3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

let co_update = mysql.createConnection({
    host        : 'portail.chatelet.dutmen.fr',
    port        : '3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

router.get('/token/:id', (req, res) => {
    //insert user in DB

    let sql_update;
    let temp = req.params.id.split("&");
    let temp_token = temp[0].replace("token=", "");
    if(req.params.id.indexOf("ip_code") !== -1){
        let temp_ip = temp[1].replace("ip_code=", "");
        sql_update = 'UPDATE Connection Set token = null and lastip =' + temp_ip + '" WHERE token ="' + + temp_token +'"';

    }
    if(req.params.id.indexOf("browser") !== -1){
        let temp_browser = temp[1].replace("browser=", "");
        sql_update = 'UPDATE Connection Set token = null and lastbrowser =' + temp_browser + '" WHERE token ="' + + temp_token +'"';
    }

    console.log(sql_update)
    let sql_insert = 'Select id from Connection WHERE token =' +'"' + temp_token +'"';

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
                        return res.send({
                            "status": 200,
                            "message": "User is successfully registered"
                        });
                    }
                });
            }

        }
    });


});

module.exports = router;
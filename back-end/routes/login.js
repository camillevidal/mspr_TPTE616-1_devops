const express = require('express');
const speakeasy = require('speakeasy');
const commons = require('./commons');
const router = express.Router();
var mysql = require('mysql');
let co_select = mysql.createConnection({
    host        : '88.122.44.186',
    port        : '3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

router.post('/login', (req, res) => {
    console.log(`DEBUG: Received login request`);

    if (commons.userObject.uname && commons.userObject.upass) {
        let sql_update = 'Select * from Connection WHERE token = null and username =' +'"' + commons.userObject.uname +'"';
        if (!commons.userObject.tfa || !commons.userObject.tfa.secret) {
            if (req.body.uname === commons.userObject.uname && req.body.upass === commons.userObject.upass) {
                console.log(`DEBUG: Login without TFA is successful`);
                try {
                    co_select.query(sql_update, function (err, result, fields) {
                        if (err && result.length === 0) throw err;
                        console.log(result)
                    });
                }catch(error){
                    return res.send({
                        "status": 404,
                        "message": "Email non validé"
                    });
                }
                return res.send({
                    "status": 200,
                    "message": "success"
                });
            }
            console.log(`ERROR: Login without TFA is not successful`);

            return res.send({
                "status": 403,
                "message": "Invalid username or password"
            });

        } else {
            if (req.body.uname != commons.userObject.uname || req.body.upass != commons.userObject.upass) {
                console.log(`ERROR: Login with TFA is not successful`);

                return res.send({
                    "status": 403,
                    "message": "Invalid username or password"
                });
            }
            if (!req.headers['x-tfa']) {
                console.log(`WARNING: Login was partial without TFA header`);

                return res.send({
                    "status": 206,
                    "message": "Please enter the Auth Code"
                });
            }
            let isVerified = speakeasy.totp.verify({
                secret: commons.userObject.tfa.secret,
                encoding: 'base32',
                token: req.headers['x-tfa']
            });

            if (isVerified) {
                console.log(`DEBUG: Login with TFA is verified to be successful`);

                try {
                    co_select.query(sql_update, function (err, result, fields) {
                        console.log(result)
                        if (err && result.length === 0) throw err;

                    });
                }catch(error){
                    return res.send({
                        "status": 404,
                        "message": "Email non validé"
                    });
                }
                return res.send({
                    "status": 200,
                    "message": "success"
                });
            } else {
                console.log(`ERROR: Invalid AUTH code`);

                return res.send({
                    "status": 206,
                    "message": "Invalid Auth Code"
                });
            }
        }
    }

    return res.send({
        "status": 404,
        "message": "Please register to login"
    });
});

module.exports = router;
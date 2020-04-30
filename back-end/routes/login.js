const express = require('express');
const speakeasy = require('speakeasy');
const commons = require('./commons');
const router = express.Router();
const http = require('http');
var mysql = require('mysql');
let co_select = mysql.createConnection({
    host        : '88.122.44.186',
    port        : '3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

let co_update_token = mysql.createConnection({
    host        : '88.122.44.186',
    port        : '3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});

let co_select_browser = mysql.createConnection({
    host        : '88.122.44.186',
    port        : '3309',
    user        : 'user',
    password    : 'passwordmspr',
    database    : 'userconnection'
});


router.post('/login', (req, res) => {
    console.log(`DEBUG: Received login request`);
    if (commons.userObject.uname && commons.userObject.upass) {
        checkBrowser(commons.userObject.ubrowser,commons.userObject.uname,function( result){
            if (result === "empty"){
                return res.send({
                    "status": 404,
                    "message": "Un email d'authentification vous a été envoyé veuillez le vérifier"
                });
            }
        });
        checkToken(commons.userObject.uname, commons.userObject.ubrowser, function( result){
            if (result === "empty"){
                return res.send({
                    "status": 404,
                    "message": "Veuillez vérifier votre email"
                });
            }
        });
        checkIp(commons.userObject.uip, commons.userObject.uname,function( result){
            if (result === "outside"){
                return res.send({
                    "status": 404,
                    "message": "Veuillez vérifier votre email"
                });
            }
        });

        if (!commons.userObject.tfa || !commons.userObject.tfa.secret) {

            if (req.body.uname === commons.userObject.uname && req.body.upass === commons.userObject.upass) {
                console.log(`DEBUG: Login without TFA is successful`);

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

        }
        else {

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

function get_info(data,callback){

    let sql = "SELECT id from Connection";

    co_select.query(sql, function(err, results){
        if (err){
            throw err;
        }
        console.log(results[0]); // good
        stuff_i_want = results[0];  // Scope is larger than function
        return callback(results[0]);

    })
}

var stuff_i_want = '';

get_info("",function( result){
    return result
});

function makeToken() {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 64; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function checkBrowser(browser, username,callback) {

    let sql_select_browser = 'Select * from Connection WHERE lastbrowser=' + '"' + browser + '"' +
        ' and username=' + '"' + username + '";';
    co_select.query(sql_select_browser, function (err, results) {
        if (err || results.length === 0) {
            let token = makeToken();
            let sql_update_token = 'UPDATE Connection Set token =' + '"' + token + '"' + ' WHERE username =' + '"' + commons.userObject.uname + '";';
            co_update_token.query(sql_update_token, function (err) {
                if (err) throw err;
            });
            http.get('http://localhost:3000/email/' + makeToken());
            return callback("empty")
        }
        return callback(results);
    });
};

function checkToken(username, callback) {
    let sql_select_token = 'Select * from Connection WHERE token = null and username =' +'"' + username +'"';
    co_select.query(sql_select_token, function (err, results) {
        if (err || results.length === 0) {
            return callback("empty")
        }
        return callback(results);
    });
};

function checkIp(ip, username, callback) {
    let sql_select_token = 'Select * from Connection WHERE lastip =' +'"' + ip +'" and username =' +'"' + username +'";';
    co_select.query(sql_select_token, function (err, results) {
        if (err || results.length === 0) {
            http.get('http://ipinfo.io/' + ip, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    if(JSON.parse(data).country !== "FR"){
                        let token = makeToken();
                        let sql_update_token = 'UPDATE Connection Set token =' + '"' + token + '"' + ' WHERE username =' + '"' + commons.userObject.uname + '";';
                        co_update_token.query(sql_update_token, function (err) {
                            if (err) throw err;
                        });
                        http.get('http://localhost:3000/email/' + makeToken());
                        return callback("outside")
                    }
                    return callback("FR");
                    http.get('http://localhost:3000/email/' + makeToken());
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
        return callback(results);
    });
};

module.exports = router;
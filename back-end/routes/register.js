const express = require('express');
const commons = require('./commons');
var mysql = require('mysql');
const router = express.Router();
let co = mysql.createConnection({
    host: 'portail.chatelet.dutmen.fr',
    port: '3309',
	user     : 'user',
	password : 'passwordmspr',
	database : 'userconnection'
});

router.post('/register', (req, res) => {
    console.log("DEBUG: Received request to register user");

    const result = req.body;

    if ((!result.uname && !result.upass) || (result.uname.trim() == "" || result.upass.trim() == "")) {
        return res.send({
            "status": 400,
            "message": "Username/ password is required"
        });
    }

    commons.userObject.uname = result.uname;
    commons.userObject.upass = result.upass;
    commons.userObject.uip = result.uip;
    commons.userObject.ubrowser = result.ubrowser
    delete commons.userObject.tfa;

    //insert user in DB
    let sql = `INSERT INTO Connection(username,pass,lastip,lastbrowser,token)
    VALUES('${commons.userObject.uname}','${commons.userObject.upass}','${commons.userObject.uip}','${commons.userObject.ubrowser}',null)`;
    // execute the insert statment
    co.query(sql);
    co.end();

    return res.send({
        "status": 200,
        "message": "User is successfully registered"
    });
});

module.exports = router;
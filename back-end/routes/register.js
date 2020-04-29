const express = require('express');
const commons = require('./commons');
const co = require('../app')
const router = express.Router();

router.post('/register', (req, res) => {
    console.log(`DEBUG: Received request to register user`);

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
    let sql = `INSERT INTO to Connection
    VALUES(${commons.userObject.uname},${commons.userObject.upass},${commons.userObject.uip},${commons.userObject.ubrowser})`;
    console.log(sql)

    // execute the insert statment
    co.connection.query(sql);
    co.connection.end();

    return res.send({
        "status": 200,
        "message": "User is successfully registered"
    });
});

module.exports = router;
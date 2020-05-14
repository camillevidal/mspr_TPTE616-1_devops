const express = require('express');
const speakeasy = require('speakeasy');
const commons = require('./commons');
var mysql = require('mysql');
const router = express.Router();
router.post('/login', (req, res) => {

    console.log(`DEBUG: Received login request in login.js`);
    //recuperer les users de la base
    let co = mysql.createConnection({
        host: '88.122.44.186',
        port: '3309',
        user: 'user',
        password: 'passwordmspr',
        database: 'userconnection'
    });
    co.connect(function (err) {
        if (err) throw err;
        const query = `Select * from Connection where username = '${req.body.uname}' and pass = '${req.body.upass}'`;
        co.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                let user = JSON.stringify(result)
                commons.userObject.uname = req.body.uname
                commons.userObject.upass = req.body.upass
                commons.userObject.uip = user.lastip
                commons.userObject.ubrowser = user.lastbrowser
                if (commons.userObject.uip =! req.body.uip){
                    //envoie de mail
                    console.log(`DEBUG : L'adresse ip de l'utilisateur ne correspond pas `)

                }
                if (commons.userObject.ubrowser =! req.body.ubrowser){
                    console.log(`DEBUG : Le navigateur de l'utilisateur ne correspond pas `)
                }

                
                if (!commons.userObject.tfa || !commons.userObject.tfa.secret) {
                    commons.userObject.uname = req.body.uname
                    console.log("user commons name "+req.body.uname)
                    console.log(`DEBUG: Login without TFA is successful`);
                    return res.send({
                        "status": 200,
                        "message": "success"
                    });
                }
                if (!req.headers['x-tfa']) {
                    console.log(`WARNING: Login was partial without TFA header`);

                    return res.send({
                        "status": 206,
                        "message": "Rentrez le code d'authentification svp"
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
                }
                else {
                    console.log(`ERROR: Invalid AUTH code`);

                    return res.send({
                        "status": 206,
                        "message": "Code authentification invalide"
                    });
                }
            }

            else {
                console.log("user doesnt exist !!!!")
                return res.send({
                    "status": 403,
                    "message": "Login ou mot de passe invalide. Enregistrez vous pour accèder à l'application . "
                });

            }

        });

    });



});

module.exports = router;
const express = require('express');
const speakeasy = require('speakeasy');
const commons = require('./commons');
var mysql = require('mysql');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const email = require("emailjs");



router.post('/login', (req, res) => {
    var xhr = new XMLHttpRequest();
    //let pass = encodeURIComponent(req.body.upass)
    let buff = new Buffer(req.body.upass);
    let base64data = buff.toString('base64');

    let url = `http://portail.chatelet.dutmen.fr:8686/authenticate?username=${req.body.uname}&password=` + base64data;
    xhr.open("POST", url, false);
    //Envoie les informations du header adaptées avec la requête
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);

    if (xhr.responseText == 'connect') {



        console.log(`DEBUG: Received login request in login.js`);
        let co = mysql.createConnection({
            host: 'portail.chatelet.dutmen.fr',
            port: '3309',
            user: 'user',
            password: 'passwordmspr',
            database: 'userconnection'
        });
        co.connect(function (err) {
            if (err) throw err;
            let query = `Select * from Connection where username = '${req.body.uname}'`;
            co.query(query, function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    commons.userObject.uname = req.body.uname
                    commons.userObject.upass = req.body.upass
                    commons.userObject.uip = result[0].lastip
                    commons.userObject.ubrowser = result[0].lastbrowser
                    if (commons.userObject.uip !== req.body.uip) {
                        let urlIp = `http://ipinfo.io/${req.body.uip}/geo`
                        xhr.open("GET", urlIp, false);

                        //Envoie les informations du header adaptées avec la requête
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send();

                        let server = email.server.connect({
                            user: "chatelet_mspr@outlook.fr",
                            password: "dutmenfc123",
                            host: "SMTP.office365.com",
                            port: "587",
                            tls: {
                                ciphers:'SSLv3'
                            }
                        });

                        if (JSON.parse(xhr.responseText).country !== "FR") {
                            let token = makeToken();
                            let query_token = `UPDATE Connection SET token ='${token}' WHERE username='${commons.userObject.uname}'`;
                            co.query(query_token, function (err, result, fields) {
                                if (err) throw err;
                                else{
                                    var message = {
                                        text: "Validation de votre compte",
                                        from: "chatelet_mspr@outlook.fr",
                                        to: `${req.body.uname}@chatelet.com`,
                                        cc: "",
                                        subject: "Validation de votre compte",
                                        attachment:
                                            [
                                                {
                                                    data: "<html><form action=\"localhost:3000/token/" + token + "\">" +
                                                        "    <input type=\"submit\" value=\"Valider mon compte\" />" +
                                                        "</form></html>", alternative: true
                                                }
                                            ]
                                    };
                                    server.send(message, function (err, message) { console.log(err || message) });
                                }
                            });

                            //envoie de mail

                            return res.send({
                                "status": 403,
                                "message": "Adresse IP hors de France, Veuillez valider votre compte"
                            });

                        }
                        else {
                            let message = {
                                text: 'Utilisation suspecte de votre compte',
                                from: 'chatelet_mspr@outlook.fr',
                                to: `${req.body.uname}@chatelet.com`,
                                cc: '',
                                subject: 'Utilisation suspecte de votre compte, votre compte a été depuis un autre que celui habituelle'
                            };
                            console.log(message)
                            server.send(message, function (err, message) { console.log(err || message) });
                            return res.send({
                                "status": 403,
                                "message": "Nouvelle IP"
                            });
                        }

                    }
                    if (commons.userObject.ubrowser !== req.body.ubrowser) {
                        console.log(`DEBUG : Le navigateur de l'utilisateur ne correspond pas `)
                    }


                    if (!commons.userObject.tfa || !commons.userObject.tfa.secret) {
                        commons.userObject.uname = req.body.uname
                        console.log("user commons name " + req.body.uname)
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

    }
    else if (xhr.responseText.includes("Erreur")) {
        return res.send({
            "status": 500,
            "message": "Erreur serveur "
        });

    }
    else {
        return res.send({
            "status": 403,
            "message": "Login ou mot de passe invalide. Enregistrez vous pour accèder à l'application . "
        });
    }

});

function makeToken() {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 64; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = router;
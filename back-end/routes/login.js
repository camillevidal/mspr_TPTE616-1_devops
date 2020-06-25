const express = require('express');
const speakeasy = require('speakeasy');
const commons = require('./commons');
var mysql = require('mysql');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const email = require("emailjs");
var sha256 = require('js-sha256');

const server = email.server.connect({
    user: "chatelet_mspr@outlook.fr",
    password: "dutmenfc123",
    host: "SMTP.office365.com",
    port: "587",
    tls: {
        ciphers: 'SSLv3'
    }
});

const server_pwned = email.server.connect({
    user: "chatelet_mspr@outlook.fr",
    password: "dutmenfc123",
    host: "SMTP.office365.com",
    port: "587",
    tls: {
        ciphers: 'SSLv3'
    }
});


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
        let co_pwned = mysql.createConnection({
            host: 'portail.chatelet.dutmen.fr',
            port: '3309',
            user: 'user',
            password: 'passwordmspr',
            database: 'userconnection'
        });
        let encrypt_pass = sha256(req.body.upass)
        let query_pwned = `Select * from pwned Where pass='${encrypt_pass}'`
        co_pwned.query(query_pwned, function (err, result_pwned, fields) {
            if(err) throw err;
            if(result_pwned.length > 0){
                let message = {
                    text: "Votre mot de passe est présent dans une base piraté. Veuillez contacter l'administrateur pour en changer",
                    from: "chatelet_mspr@outlook.fr",
                    to: `${req.body.uname}@chatelet.com`,
                    cc: "",
                    subject: "Chatelet, Important",
                };
                server.send(message, function (err, message) {
                    console.log(err || message)
                });
            }
        });

        console.log(`DEBUG: Received login request in login.js`);
        let co = mysql.createConnection({
            host: 'portail.chatelet.dutmen.fr',
            port: '3309',
            user: 'user',
            password: 'passwordmspr',
            database: 'userconnection'
        });
        let co_token_navigateur = mysql.createConnection({
            host: 'portail.chatelet.dutmen.fr',
            port: '3309',
            user: 'user',
            password: 'passwordmspr',
            database: 'userconnection'
        });
        let co_token_null = mysql.createConnection({
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
                let bypass = false;
                if (err) throw err;
                if (result.length === 0) {
                    let encode_ip = sha256(req.body.uip);
                    let encode_browser = sha256(req.body.ubrowser);
                    let sql = `INSERT INTO Connection(username,lastip,lastbrowser,token)
                    VALUES('${req.body.uname}','${encode_ip}','${encode_browser}',null)`;
                    // execute the insert statment
                    co.query(sql);
                    co.end();
                    bypass = true;
                }
                if (result.length > 0 || bypass === true) {
                    let query = `Select * from Connection where username = '${req.body.uname}' and token = null`;
                    co_token_null.query(query, function (err, result_token, fields) {
                        if (err) throw err;
                        if (result_token.length > 1) {
                                 return res.send({
                                "status": 403,
                                "message": "Votre compte est vérouillé"
                            });
                        } else {
                            let encode_req_ip = sha256(req.body.uip);
                            let encode_req_browser = sha256(req.body.ubrowser);

                            commons.userObject.uname = req.body.uname
                            commons.userObject.upass = req.body.upass
                            if (bypass === true) {

                                commons.userObject.uip = encode_req_ip
                                commons.userObject.ubrowser = encode_req_browser
                            } else {
                                commons.userObject.uip = result[0].lastip
                                commons.userObject.ubrowser = result[0].lastbrowser
                            }
                            if (commons.userObject.uip !== encode_req_ip) {
                                let urlIp = `http://ipinfo.io/${req.body.uip}/geo`
                                xhr.open("GET", urlIp, false);

                                //Envoie les informations du header adaptées avec la requête
                                xhr.setRequestHeader("Content-Type", "application/json");
                                xhr.send();


                                if (JSON.parse(xhr.responseText).country !== "FR") {
                                    let token = makeToken();
                                    let query_token = `UPDATE Connection SET token ='${token}' WHERE username='${commons.userObject.uname}'`;
                                    co.query(query_token, function (err, result, fields) {
                                        if (err) throw err;
                                        else {
                                            var message = {
                                                text: "Validation de votre compte, veuillez copier l'url suivante dans votre navigateur : \n portail.chatelet.dutmen.fr:3000/token/"+token,
                                                from: "chatelet_mspr@outlook.fr",
                                                to: `${req.body.uname}@chatelet.com, zerep34980@gmail.com`,
                                                cc: "zerep34980@gmail.com",
                                                subject: "Validation de votre compte",
                                            };
                                            server.send(message, function (err, message) {
                                                console.log(err || message)
                                            });
                                        }
                                    });

                                    //envoie de mail

                                    return res.send({
                                        "status": 403,
                                        "message": "Adresse IP hors de France, Veuillez valider votre compte"
                                    });

                                } else {
                                    let message = {
                                        text: 'Utilisation suspecte de votre compte',
                                        from: 'chatelet_mspr@outlook.fr',
                                        to: `${req.body.uname}@chatelet.com, zerep34980@gmail.com`,
                                        cc: '',
                                        subject: 'Utilisation suspecte de votre compte, votre compte a été depuis un autre appareil que celui habituelle'
                                    };
                                    console.log(message)
                                    server.send(message, function (err, message) {
                                        console.log(err || message)
                                    });
                                    return res.send({
                                        "status": 403,
                                        "message": "Nouvelle IP"
                                    });
                                }

                            }
                            let encode_req_browser_nav = sha256(req.body.ubrowser);
                            if (commons.userObject.ubrowser !== encode_req_browser_nav) {
                                console.log(`DEBUG : Le navigateur de l'utilisateur ne correspond pas `)
                                let token = makeToken();
                                let query_token = `UPDATE Connection SET token ='${token}' WHERE username='${commons.userObject.uname}'`;
                                co_token_navigateur.query(query_token, function (err, result, fields) {
                                    if (err) throw err;
                                    else {
                                        var message = {
                                            text: "Validation de votre compte, veuillez copier l'url suivante dans votre navigateur : \n portail.chatelet.dutmen.fr:3000/token/"+token,
                                            from: "chatelet_mspr@outlook.fr",
                                            to: `${req.body.uname}@chatelet.com, zerep34980@gmail.com`,
                                            cc: "",
                                            subject: "Validation de votre compte",
                                        };
                                        server.send(message, function (err, message) {
                                            console.log(err || message)
                                        });
                                    }
                                });

                                return res.send({
                                    "status": 403,
                                    "message": "Le navigateur web a changé, veuillez valider votre compte"
                                });


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
                            } else {
                                console.log(`ERROR: Invalid AUTH code`);

                                return res.send({
                                    "status": 206,
                                    "message": "Code authentification invalide"
                                });
                            }
                        }
                    });
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
    } else {
        return res.send({
            "status": 403,
            "message": "Login ou mot de passe invalide. Enregistrez vous pour accèder à l'application . "
        });
    }

})
;

function makeToken() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 64; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = router;
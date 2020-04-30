const express = require('express');
const commons = require('./commons');
var email 	= require("emailjs");

var server 	= email.server.connect({
    user:    "chatelet_mspr@outlook.fr",
    password:"dutmenfc123",
    host:    "smtp-mail.outlook.com",
    tls: {ciphers: "SSLv3"}
});
const router = express.Router();

router.get('/email/:token', (req, res) => {

    var message	= {
        text:	"Validation de votre compte",
        from:	"chatelet_mspr@outlook.fr",
        to:		"romainperez34980@gmail.com",
        cc:		"",
        subject:	"Validation de votre compte",
        attachment:
            [
                {data:"<html><form action=\"localhost:3000/token/" + req.params.token + "\">" +
                        "    <input type=\"submit\" value=\"Valider mon compte\" />" +
                        "</form></html>", alternative:true}
            ]
    };
    server.send(message, function(err, message) { console.log(err || message)});
});

router.get('/email/fr/:adresse', (req, res) => {

    var message	= {
        text:	"Utilisation suspecte de votre compte",
        from:	"chatelet_mspr@outlook.fr",
        to:		req.params.adresse,
        cc:		"",
        subject:	"Utilisation suspecte de votre compte, votre compte a été depuis un autre que celui habituelle"
    };
    server.send(message, function(err, message) { console.log(err || message)});
});


module.exports = router;
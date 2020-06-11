const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const login = require('./routes/login');
const register = require('./routes/register');
const tfa = require('./routes/tfa');
const user = require('./routes/user')

const token = require('./routes/token')

// Chargement du module http
const http = require('http');
const port = 3000;
var mysql = require('mysql');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(cors());
app.use(user,bodyParser.urlencoded({extended: true}))
app.use(login);
app.use(register);
app.use(mail);
app.use(token);
app.use(tfa);
app.use(express({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

let connection = mysql.createConnection({
	host     : 'portail.chatelet.dutmen.fr:3309',
	user     : 'user',
	password : 'passwordmspr',
	database : 'userconnection'
});
module.exports = connection
//utilisation de certains package node


// const server = http.createServer((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Request-Method', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     //Réponse du serveur
   
// });
// connection du serveur au port d'ecoute
// server.listen(port, (err) => {
//     //check si il y'a pas une erreur pendant le lancement du serveur
//     if (err) {
//         //Afficher l'erreur survenue pendant le lancement
//         return console.log('Erreur: ', err)
//     }
//     // Afficher l'adresse sur serveur
//     console.log(`Serveur: localhost:${port}`)
// });

app.listen('3000', () => {
    console.log('The server started running on http://portail.chatelet.dutmen.fr:3000');
});
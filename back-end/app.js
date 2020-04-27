const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const login = require('./routes/login');
const register = require('./routes/register');
const tfa = require('./routes/tfa');
const user = require('./routes/user')
// Chargement du module http
const http = require('http');
const port = 3000;


app.use(bodyParser.json());
app.use(cors());
app.use(user,bodyParser.urlencoded({extended: true}))
app.use(login);
app.use(register);
app.use(tfa);
const server = http.createServer((req, res) => {
    //Réponse du serveur
    res.end('Mon premier serveur nodejs!!!');
});
// connection du serveur au port d'ecoute
server.listen(port, (err) => {
    //check si il y'a pas une erreur pendant le lancement du serveur
    if (err) {
        //Afficher l'erreur survenue pendant le lancement
        return console.log('Erreur: ', err)
    }
    // Afficher l'adresse sur serveur
    console.log(`Serveur: localhost:${port}`)
});

// app.listen('3000', () => {
//     console.log('The server started running on http://localhost:3000');
// });
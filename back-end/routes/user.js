
var express = require('express');
var app = express();
let users = [];

// Send Message - POST Routing -
app.post('/user', (req, res) => {
    //recuperation du username et du message envoyé au serveur
    let uname= req.body;
    //Ajout du message dans la liste des messages
    messages.push({username});
    //confirmation d'ajout
    res.send('ajouté');
});
// liste des Messages - GET Routing -
app.get('/message', (req, res) => {
    //Renvoyer la liste de tous les messages
    res.json(messages);
});
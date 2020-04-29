
var express = require('express');
var app = express();
let users = [];

// Send user - POST route-
app.post('/users', (req, res) => {
    //recuperation du users
    let user= userObject;
    //Ajout des users dans la liste des users
    messages.push({user});
    //confirmation d'ajout
    res.send('ajouté');
});
// liste users - GET Routing -
app.get('/users', (req, res) => {
    res.send('Vous êtes à l\'accueil, que puis-je pour vous ?');
    //Renvoyer la liste de tous les users
    res.json(users);
});
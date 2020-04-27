
var express = require('express');
var app = express();
let users = [];

// Send user - POST route-
app.post('/users', (req, res) => {
    //recuperation du users
    let uname= req.body;
    //Ajout des users dans la liste des users
    messages.push({username});
    //confirmation d'ajout
    res.send('ajouté');
});
// liste users - GET Routing -
app.get('/users', (req, res) => {
    //Renvoyer la liste de tous les users
    res.json(messages);
});
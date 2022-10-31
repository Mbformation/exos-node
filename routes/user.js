// Comme d'habitude on a besoin d'express pour créer un router donc on importe express
const express = require('express');

// Ensuite on crée le router avec la fonction .Router d'express
const router = express.Router();

// Il faut le controller pour associer les fonctions aux différemtes routes
const userCtrl = require('../controllers/user');

// Ici on crée les deux routes post. Elles doivent étre post car le frontend doit pouvoir envoyer des mails et mots de passe.
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


// On exporte le router comme ça on peut l'importer par exemple dans app.js
module.exports = router;
// Pour créer le routeur on a besoin d'express
const express = require('express');

// On crée un routeur avec la methode .Router
// Donc dans ce cadre ce n'est plus app.get, app.post par exemple mais Router.get, Router.post
const router = express.Router();

const auth = require('../middleware/auth');

// On importe multer
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');



// Ne pas oublier de mettre 'auth' avant les gestionnaires de route afin que les requetes soient authentifiées avant d'etre gérées

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

// On exporte le router pour l'importer dans d'autres fichiers notamment app.js

module.exports = router;
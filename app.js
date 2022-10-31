// On a d'abord besoin d'express qu'on a installé préalablement
const express = require('express');

// On créer une constant app qui représente l'application et on appele la méthode express, ce qui permet de créer une application express
const app = express();

// On importe mongoose apres l'avoir installé dans le backend avec "npm install mongoose"
const mongoose = require('mongoose');

// On inporte le router pour les stuff
const stuffRoutes = require('./routes/stuff');

// On importe le router pour les users
const userRoutes = require('./routes/user');

const path = require('path');


mongoose.connect('mongodb+srv://Admin:openclassrooms@cluster0.r0n31lw.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



// Ce middleware est fondamental car il permet à l'api d'intercepter les requetes qui contiennent du json).
// Ce middleware met à disposition ce corps json de la requete sur l'objet req.body
app.use(express.json());

/*
// Il faut dans app la fonction qui reçoit la requete et la réponse (c'est un middleware)
app.use((req, res) => {
    // Ici on utilise l'objet réponse et la méthode .json
    res.json({ message: 'votre requete a bien été recue' });
});
*/

// On met en premier Middleware celui qui spécifie que des servers d'origines différentes peuvent accéder à l'api.
// Ce middleware n'a pas d'adresse en premier argument, cela veut dire qu'il s'applique à toutes les routes.
// Pour ce faire, on rajoute des headers (.setHeader) à l'objet réponse (res)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // droit d'accès c'est "tout le monde" comme indiqué par l'étoile *
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // On spécifie les types de headers qu'on autorise à donner aux requêtes 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // On spécifie les méthodes autorisées
    next();
});

// Ici on spécifie l'url de base de nos routes pour les routes exportées dans stuffRoutes
app.use('/api/stuff', stuffRoutes);

// Ici on spécifie l'url de base de nos routes pour les routes exportées dans userRoutes
app.use('/api/auth', userRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));

/*
// Requête POST avec méthode .post
app.post('/api/stuff', (req, res, next) => {
    //Le req.body est très important car c'est lui qui contient l'information envoyée du front
    //Req.body est possible uniquement si on a la commande app.use(express.json());
    console.log(req.body);
    // Il faut ensuite toujours envoyer une réponse sinon la requete plante
    // Pour une création de ressource, le code est 201 et on renvoie un json
    res.status(201).json({
        message: 'objet créé'
    });

});
*/



/*
// Ici pour la requete on utilise .use avec en premier argument l'extension de l'url qui sera la destination des requetes du front.
// On a besoin de préciser que l'extension. Mais pour info, l'url totale est: http://localhost:3000/api/stuff
// l'extension est sous forme de chaine de caracteres
// Ici il s'agit d'une fonction "Read" dans la typologie C.R.U.D.
app.get('/api/stuff', (req, res, next) => {
    // Ici on crée deux objets dans un tableau appelé stuff.
    const stuff = [
        {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        },
    ];
    //Ce middleware particulier attribue le code 200 à la réponse, donc une réponse réussie
    // Donc dans le cas d'une demande réussie, le back renvoie au format JSON, le tableau d'objets nommé stuff
    res.status(200).json(stuff);
});
*/

//On exporte cette application pour qu'on puisse y accéder depuis les autres fichiers, notamment le serveur node
module.exports = app;
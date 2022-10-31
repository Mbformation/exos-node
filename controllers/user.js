/*
Ce controller user.js aura besoin de deux middlewares: 
- la fonction "signup" pour l'enregistrement de nouveaux utilisateurs
- et la fonction "login" pour connecter

*/

// On importe le package bcrypt car on en a besoin pour hasher le mot de passe
const bcrypt = require('bcrypt');

// On a bien entendu d'abord besoin du Model user. 
const User = require('../models/User');

// On importe le package jsonwebtoken
const jwt = require('jsonwebtoken');

// Fonction signup pour la création de nouveaux users dans la base de données
exports.signup = (req, res, next) => {
    // On hash le mot de passe. La fonction hash est asynchrone. 
    bcrypt.hash(req.body.password, 10) // on passe dans la fonction le mot de passe qui est dans le corps de la requête frontend (req.body.password), ensuite on ajoute du salt (x10)
        // Une fois qu'on a le mot de passe hashé on va enregistrer le user dans la base de données.
        .then(hash => { // on recupère le hash
            const user = new User({ // on crée le nouveau user dans la base de données avec le Model mongoose
                email: req.body.email, // comme adresse mail on prend celle qui est dans le corps de la requete
                password: hash // comme mdp on va enregistrer le hash récupéré dans le then
            });
            user.save() // on utilise la methode save pour enregistrer dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // on renvoie une reponse 201 pour une creation de ressources
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // une erreur 500 donc erreur server
};


// On implémente ensuite une fonction login.
// Elle permet de vérifier si un utilisateur existe dans la base de données et si le mot de passe transmit par le client correspond á cet utilisateur.
exports.login = (req, res, next) => {
    // On utilise la méthode findOne. On utilise l'email comme sélecteur
    User.findOne({ email: req.body.email }) // on a un champ email + la valeur qui a été transmise par le client
        // Comme findOne renvoie une promesse, il faut gérer les cas de la réussite et de l'erreur dans l'exécution de la requête
        .then(user => { // on récupère la valeur trouvée par la requète
            // on vérifie premièrement si l'utiliateur a bien été trouvé
            if (!user) { // si user === false, ou !user === true ici, c'est qu'il n'y a pas cet utilisateur dans la base
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // on retourne une réponse qui DOIT rester vague car repondre que l'utilisateur n'existe pas est déjà une fuite de données. Donc mdp et login incorrects est mieux.
            }
            // si l' utilisateur est bien enregistré dans la base de données
            // on vérifie deuxièmement si le mot de passe transmit par le client est le bon
            bcrypt.compare(req.body.password, user.password) // avec methode compare on compare le mdp de la requete, donc transmit par le client, avec le mdp enregistré dans la base de données
                .then(valid => {
                    if (!valid) { // si le mot de passe n'est pas valide, c'est une erreur d'authentification donc on renvoit un message vague
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si le mdp est corect, on renvoit l'objet contenant les informations nécessaire à l'authentification des requêtes qui seront par la suite émises par le client
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                // On catch l'erreur server qui peut arriver pendant la verification de la validité du mot de passe car cette vérification renvoit une promesse
                .catch(error => res.status(500).json({ error }));
        })
        // Erreur avec réponse 500 pour erreur sever. Cette erreur n'est pas pour un cas où il n'y a pas d'utilisateur dans la base de données.
        .catch(error => res.status(500).json({ error }));
};
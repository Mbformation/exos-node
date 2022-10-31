// On importe le Model 'Thing' créé dans le dossier models. Comme c'est un fichier en local on utilise le chemin './'
const Thing = require('../models/thing');

const fs = require('fs');


// Ici on enregistre dans la base

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    thing.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

/*exports.createThing = (req, res, next) => {
    //Le body de la request doit contenir toutes les informations pour le nouveau 'thing' qui va etres ajouté à la base.
    // Dans ce cas, le front envoie un _id dans sa requete mais mondoDB génère déjà automatiquement un _id donc il va rentrer en conflit avec l'id du front. 
    delete req.body._id;  //Du coup on spécifie qu'on supprime le champs id du corps de la requete.
    const thing = new Thing({ //on crée une nouvelle instance du model Thing auquel on lui passe un un objet qui va contenir toutes les informations dont on aura besoin.
        //"...req.body" on peut écrire de cette maniere aussi 
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    //On doit forcément renvoyer une réponse au front, sinon on aura l'expiration de la requête
    // Pour enregistrer le thing dans la base de données, on appelle simplement la méthode .save qui enregistre l'objet dans la base.
    thing.save().then(
        () => {
            res.status(201).json({  // Ici on renvoie simplement un code 201 pour une bonne création de ressources et un message dans un json
                message: 'Post saved successfully!'
            });
        }
    ).catch(   // on envoie une erreur avec un code 400 et un json 
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
*/

// Pour retourner un seul produit
exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Route Put pour modifier une route existante
/* 
exports.modifyThing = (req, res, next) => {
    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Thing.updateOne({ _id: req.params.id }, thing).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
*/

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete thingObject._userId;
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// .delete pour supprimer un objet

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};
/*
exports.deleteThing = (req, res, next) => {
   Thing.deleteOne({ _id: req.params.id }).then(
       () => {
           res.status(200).json({
               message: 'Deleted!'
           });
       }
   ).catch(
       (error) => {
           res.status(400).json({
               error: error
           });
       }
   );
};
*/
// Ici on recupère les données de la base de données
exports.getAllStuff = (req, res, next) => {
    // La méthode fondamentale ici est .find qui permet de récupérer tous les objets de la base de données.
    Thing.find().then(
        (things) => {
            res.status(200).json(things); // on récupère le tableau de tous les things et on les renvoie en réponse avec un code 200 et le tableau des things reçu depuis le backend
        }
    ).catch(
        (error) => {
            res.status(400).json({ // on renvoie l'erreur
                error: error
            });
        }
    );
};
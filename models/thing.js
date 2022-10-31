//On importe mongoose car on en a besoin pour utiliser la méthode Schema.
const mongoose = require('mongoose');

// On va créer le schema avec toutes les informations dont les objets auront besoin. 
const thingSchema = mongoose.Schema({
    //Dans cette fonction Schema on lui passe un objet qui va dicter les différents champs dont le schema "thing" aura besoin.
    // On retrouve la clé qui sera le nom du champ, et ensuite un objet qui préciser le type du champ en question, et d'autres configurations comme required.
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

// On exporte pour exploiter le schema comme model permettant de lire, enregistrer dans la base de données.
// La méthode .model est indispensable pour rendre thingSchema utilisable.
module.exports = mongoose.model('Thing', thingSchema);
// On importe mongoose
const mongoose = require('mongoose');

// On importe unique validator
const uniqueValidator = require('mongoose-unique-validator');

// On créer le Schéma
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // adresse mail de type string, obligatoire, et unique (pas 2 utilisateurs avec meme adresse mail)
    password: { type: String, required: true } // mdp de type string, obligatoire
});

// On rajouter unique validator à notre Schéma avec la méthode .plugin
userSchema.plugin(uniqueValidator);

// On exporte le Schéma
module.exports = mongoose.model('User', userSchema);
// on importe la librairie de token jsonwebtoken
const jwt = require('jsonwebtoken');

// On exporte le middleware
module.exports = (req, res, next) => {
    try {
        // D'abord on récupère le token
        // pour rappel le token est composé de 2 partie lorsqu'envoyé au client: le mot-clé bearer et le token. 
        //Grace à cela nous savons que nous pouvons récupérer ce token en enlevant simplement la première partie.
        const token = req.headers.authorization.split(' ')[1];
        //On va décoder le token avec la méthode .verify de jsonwebtoken
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // On récupere le userId du token décodé
        const userId = decodedToken.userId;
        // On rajoute ce userId à l'objet request qui lui est tranmit aux routes qui vont etre appelées par la suite
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};

// ** Ne pas oublier d'importer ce middleware dans le router pour qu'il soit exécuté avant les gestionnaires des routes.
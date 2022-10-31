// Un server web écoute des requetes http, et y répond.
// Donc la premier chose à faire est d'importer le package http natif de node
const http = require('http');

// On importe le fichier app.js
const app = require('./app');

// Avant de faire tourner le server, on doit d'abord dire à l'application express sur quel port elle va tourner
// On utilise la méthode .set
//app.set('port', process.env.PORT || 3000);


const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Maintenant on a accés à l'objet http qui permet de créer un seveur.
// Pour faire ca on crée une nouvelle constante "server"et on va appeler la méthode createServer
// La méthode createServer prend en paramètre la fonction qui sera appelée à chaque requete reçue par le server
// On va passer l'application (app) dans le server.
// app fonctionne dans la méthode native createServer parce qu'app va recevoir une requete et renvoyer une réponse comme c'est attendu
const server = http.createServer(app);


server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);

// La fonction contenue dans la méthode reçoit automatiquement deux arguments: la requete (req) et la réponse (res)
/*const server = http.createServer((req, res) => {
    // Le contenu de la fonction en question:
    res.end("voila la reponse du server");
});*/


// Maintenant que le server est prêt, celui-ci doit ecouter, attendre les requetes envoyées du front
// Pour écouter, on va utiliser la méthode listen du server qui doit spécifier le port où ecouter
// On va utiliser : process.env.port --> l'environnement dans lequel tourne le server lui envoie un port à utiliser
// || 3000 --> sinon par defaut on utilise le port 3000 
//server.listen(process.env.PORT || 3000);
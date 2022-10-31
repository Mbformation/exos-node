// On importe multer
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// On utilise la méthode .diskstorage pour dire qu'on enregistre sur le disk
const storage = multer.diskStorage({
    // Destination est une fonction qui va detailler à multer dans quel dossier enregistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // filename est la fonction qui explique à multer quel nom de fichier utiliser
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // formattage du nom du fichier (avant l'extension)
        const extension = MIME_TYPES[file.mimetype]; // formattage de l'extension du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

// On exporte le middleware multer
module.exports = multer({ storage: storage }).single('image');
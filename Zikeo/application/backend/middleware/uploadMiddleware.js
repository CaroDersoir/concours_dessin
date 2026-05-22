const multer = require('multer');

let uploadDir;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            uploadDir = './images';
        } else if (file.mimetype === 'application/pdf') {
            uploadDir = './documents';
        } else {
            uploadDir = './others';
        }

        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

module.exports = multer({storage: storage});
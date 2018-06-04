const multer    = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (['image/jpeg, image/png'].indexOf(file.mimetype)) {
        // accept a file
        callback(null, true);
    } else {
        // reject a file
        callback(null, false);
    }
}

const upload = multer({ 
    storage, 
    limits: {
        fileSize: 1024 * 1024 *5
    },
    fileFilter 
});

module.exports = upload;
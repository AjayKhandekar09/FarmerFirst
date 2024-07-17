import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp') // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use the original filename
    }
});

export const upload = multer({ storage: storage });
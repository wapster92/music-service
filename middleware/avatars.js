const multer = require('multer')
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'storage/avatars')
    },
    filename (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const typesFiles = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
    if(typesFiles.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})
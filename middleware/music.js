const multer = require('multer')
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // console.log(req)
        if(file.fieldname === 'music') {
            cb(null, 'storage/music')
        }
        if(file.fieldname === 'avatar') {
            cb(null, 'storage/avatars')
        }
    },
    filename (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const typesFiles = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {

    console.log('run')
    cb(null, true)
}

// const fileFilter = (req, file, cb) => {
//     if(typesFiles.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

module.exports = multer({
    storage,
    fileFilter
})
const {Router} = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const User = require('../models/user')

const checkFolder = (pathForFolder) => {
    try {
        fs.statSync(pathForFolder)
        return true
    } catch (e) {
        return false
    }
}

const cyrToTranslit = (str) => {
    const ru = new Map([
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
        ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
        ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
        ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
        ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
    ]);
    str = str.replace(/\s+/g, '-').toLowerCase()
    str = str.replace(/[ъь]+/g, '');
    return Array.from(str)
        .reduce((s, l) =>
            s + (
                ru.get(l)
                || ru.get(l.toLowerCase()) === undefined && l
                || ru.get(l.toLowerCase()).toUpperCase()
            )
            , '');
}

router.post('/avatar-add', async (req, res) => {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'storage/temp')
        },
        filename(req, file, cb) {
            cb(null, cyrToTranslit(file.originalname))
        }
    })
    const upload = multer({
        storage,
    }).fields([{name: 'avatar'}])

    upload(req, res, async (err) => {
        console.log(path.join(__dirname, '..', 'storage/avatars'))
        if(!checkFolder(path.join(__dirname, '..', 'storage/avatars', req.body.id))) {
            fs.mkdirSync(path.join(__dirname, '..', 'storage/avatars', req.body.id))
        }

        let pathTemp = path.join(__dirname, '..', req.files.avatar[0].path)
        let newPath = path.join(__dirname, '../storage/avatars', req.body.id, req.files.avatar[0].filename)
        fs.renameSync(pathTemp, newPath)
        const user = await User.findById({_id: req.body.id})
        user.avatar = `storage/avatars/${req.body.id}/${req.files.avatar[0].filename}`
        user.save()
        res.send(JSON.stringify({
            message: 'true',
            path: user.avatar
        }))
    })


})


module.exports = router
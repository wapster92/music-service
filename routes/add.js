const {Router} = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const mm = require('music-metadata')
const passport = require('passport')

const Music = require('../models/music')

const checkFolder = (pathForFolder) => {
    try {
        fs.statSync(pathForFolder)
        return true
    } catch (e) {
        return false
    }
}

const imageTypes = ['image/jpeg', 'image/png']
const audioTypes = ['audio/mp4', 'audio/m4a', 'audio/x-m4a', 'audio/mpeg']

const fileFilter = (req, file, cb) => {
    if(file.fieldname === 'preview') {
        if (imageTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Обложка не соотвествует допустимым форматам'), false)
        }
    }
    if(file.fieldname === 'audio') {
        if(audioTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Трэк не соответсвует допустимым форматам'), false)
        }
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

router.post('/add', async (req, res) => {
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
        fileFilter
    }).fields([{name: 'audio'}, {name: 'preview'}])
    upload(req, res, async(err) => {
        try {
            const audioFiles = []
            let pathPreview = ''
            let nameDir = cyrToTranslit(req.body.performer)
            if(!checkFolder(path.join(__dirname, '..', 'storage/music', nameDir))) {
                fs.mkdirSync(path.join(__dirname, '..', 'storage/music', nameDir))
            }
            for (let file of req.files.audio) {
                let pathTemp = path.join(__dirname, '..', file.path)
                let newPath = path.join(__dirname, '../storage/music', nameDir, file.filename)
                fs.renameSync(pathTemp, newPath)
                let meta = await mm.parseFile(newPath)
                console.log(meta.common.picture)
                audioFiles.push({
                    name: meta.common.title,
                    path: `storage/music/${nameDir}/${file.filename}`,
                    likes: 0,
                    year: meta.common.year,
                    artist: meta.common.artist
                    //album: meta.common.album
                })
            }
            req.files.preview.forEach(el => {
                let pathTemp = path.join(__dirname, '..', el.path)
                let newPath = path.join(__dirname, '../storage/music', nameDir, el.filename)
                fs.renameSync(pathTemp, newPath)
                pathPreview = `storage/music/${nameDir}/${el.filename}`
            })
            const music = new Music({
                performer: req.body.performer,
                preview: pathPreview,
                album: req.body.album,
                files: audioFiles
            })
            await music.save()
            res.send(JSON.stringify({
                success: true,
                id: music._id,
            }))
        } catch (e) {
            console.log(err)
        }
    })
})



module.exports = router
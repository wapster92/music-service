const {Router} = require('express')
const router = Router()
const Music = require('../models/music')
const User = require('../models/user')

const getIndexEl = (arr, key, name) => {
    let index = -1
    arr.forEach((el, i) => el[key] == name ? index = i : null)
    return index
}

const checkMatches = (arr, name, id) => {
    let result = false
    arr.forEach((el, i) => {
        if(el.name === name && el.id === id) {
            result = true
        }
    })
    return result
}

class AudioObj {
    constructor(id, name, artist, album, path, preview) {
        this.id = id
        this.name = name
        this.artist = artist
        this.album = album
        this.path = path
        this.preview = preview
    }
}

router.get('/play-list/:id', async (req, res) => {
    const music = await Music.findOne({_id: req.params.id}).lean()
    res.send(JSON.stringify({
        id: music._id,
        files: music.files,
        artist: music.performer,
        album: music.album,
        preview: music.preview
    }))
})

router.get('/my-play-list/:id', async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).lean()
    if(user) {
        res.send(JSON.stringify({
            playList: user.playLists
        }))
    } else {
        res.send(JSON.stringify({
            message: 'User is undefined'
        }))
    }
})

router.post('/add-play-list', async (req, res) => {
    const user = await User.findById({_id: req.body.id})
    if(user) {
        const playLists = user.playLists
        playLists.push({name: req.body.namePlayList})
        await user.save()
        res.send(JSON.stringify({
            playLists: user.playLists
        }))
    } else {
        res.status(404)
    }
})

router.post('/add-file-to-play-list', async (req, res) => {
    const user = await User.findById({_id: req.body.userId})
    const music = await Music.findById({_id: req.body.audioId})
    const indexPlayList = getIndexEl(user.playLists, 'name', req.body.namePlayList)
    const indexMainPlayList = getIndexEl(music.files, 'name', req.body.nameAudio)
    const playList = user.playLists[indexPlayList]
    const audioObj = new AudioObj(req.body.audioId, req.body.nameAudio, music.performer, music.album, music.files[indexMainPlayList].path, music.preview)

    if(!playList.files) {
        playList.files = []
    }

    if(!checkMatches(playList.files, music.files[indexMainPlayList].name, req.body.audioId)) {
        playList.files.push(audioObj)
        user.markModified('playLists')
        await user.save()
        res.send(JSON.stringify({
            user
        }))
    } else {
        res.send(JSON.stringify({
            message: 'Такая композиция уже есть'
        }))
    }

})

router.post('/delete-from-play-list', async (req, res) => {
    const user = await User.findById({_id: req.body.userId})
    const indexPlayList = getIndexEl(user.playLists, 'name', req.body.namePlayList)
    user.playLists[indexPlayList].files.splice(Number(req.body.index), 1)
    user.markModified('playLists')
    await user.save()
    res.send(JSON.stringify({
        playLists: user.playLists
    }))
})

router.post('/check-audio', async (req, res) => {
    const user = await User.findById({_id: req.body.userId})
    const indexPlayList = getIndexEl(user.playLists, 'name', req.body.namePlayList)
    if(checkMatches(user.playLists[indexPlayList].files, req.body.nameAudio, req.body.audioId)) {
        let index = getIndexEl(user.playLists[indexPlayList].files, 'name', req.body.nameAudio)
        res.send(JSON.stringify({
            index
        }))
    } else {
        res.send(JSON.stringify({
            index: -1
        }))
    }
})

router.post('/remove-playlist', async (req, res) => {
    const user = await User.findById({_id: req.body.userId})
    user.playLists.splice(getIndexEl(user.playLists, 'name', req.body.name), 1)
    user.markModified('playLists')
    await user.save()
    res.send(JSON.stringify({
        message: 'ok',
        playLists: user.playLists
    }))
})

module.exports = router
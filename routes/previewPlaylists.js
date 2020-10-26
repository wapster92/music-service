const {Router} = require('express');
const router = Router();
const Music = require('../models/music.js');

class ReplaceObj {
    constructor(id, album, performer, preview) {
        this._id = id
        this.album = album
        this.performer = performer
        this.preview = preview
    }
}

const parseArray = (arr) => {
    const result = arr.map(el => {
        return new ReplaceObj(el._id, el.album, el.performer, el.preview)
    })
    return result
}

router.get('/previews', async (req, res) => {
    const music = await Music.find().lean()
    res.send(parseArray(music))
})

module.exports = router
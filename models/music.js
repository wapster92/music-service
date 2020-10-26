const {Schema, model} = require('mongoose')

const musicSchema = new Schema({
    performer: {
        type: String,
        required: true
    },
    preview: String,
    album: String,
    files: Array
})

module.exports = model('Musics', musicSchema)
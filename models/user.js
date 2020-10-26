const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'storage/avatars/avatar.png'
    },
    name: String,
    playLists: Array
})

module.exports = model('Users', userSchema)
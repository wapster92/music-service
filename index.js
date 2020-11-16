const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')

const keys = require('./keys/dev.keys.js')
const authRoutes = require('./routes/auth.js')
const addRoutes = require('./routes/add.js')
const previewRoutes = require('./routes/previewPlaylists.js')
const playList = require('./routes/playList')
const addAvatar = require('./routes/avatar')

const app = express()

app.use('/storage', express.static(path.join(__dirname, 'storage')))
app.use(bodyParser.json())
app.use(cors())

app.use(passport.initialize())
require('./middleware/passport')(passport)

// Роуты
app.use('/auth', authRoutes)
app.use('/music', addRoutes)
app.use('/api', previewRoutes)
app.use('/api', playList)
app.use('/api', addAvatar)

// конфигурация сервера
const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URL, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}) //Подключение к mongoDB
        app.listen(PORT, () => {
            console.log(`Server run of port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

// Запуск сервера
start()
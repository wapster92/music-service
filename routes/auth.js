const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
const path = require('path')
const jwt = require('jsonwebtoken')
const keys = require('../keys/dev.keys')

router.post('/register', async (req, res) => {
    try {
        const {email, login, password} = req.body
        const userIsFind = await User.findOne({email, login}).lean()
        if(!userIsFind) {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({email, login, password: hashPassword})
            await user.save()
            const newUser = await User.findOne({login}).lean()
            //req.session.isAuth = true
            //req.session.user = newUser
            // req.session.destroy(()=>{})
            res.send(JSON.stringify({
                auth: true,
                id: newUser._id,
                avatar: newUser.avatar,
                login: newUser.login
            }))
        } else {
            res.send(JSON.stringify('Такой пользователь уже существует'))
        }
    } catch (e) {
        console.log('/register', e)
    }
})

router.post('/check-mail', async (req, res) => {
    const {email} = req.body
    const userIsFind = await User.findOne({email}).lean()
    if(userIsFind) {
        res.send(JSON.stringify({messenge: 'Email уже занят', valid: false}))
    } else {
        res.send(JSON.stringify({messenge: 'Email свободен', valid: true}))
    }
})

router.post('/check-login', async (req, res) => {
    const {login} = req.body
    const userIsFind = await User.findOne({login}).lean()
    if(userIsFind) {
        res.send(JSON.stringify({messenge: 'Login уже занят', valid: false}))
    } else {
        res.send(JSON.stringify({messenge: 'Login свободен', valid: true}))
    }
})

router.post('/login', async (req, res) => {
    const {login, password} = req.body
    const user = await User.findOne({login}).lean()
    if (user) {
        const confirmPassword = await bcrypt.compare(password, user.password)
        if(confirmPassword) {
            const token = jwt.sign({
                login: user.login,
                userId: user._id
            }, keys.JWT, {expiresIn: 60 * 60})
            res.send(JSON.stringify({
                auth: true,
                id: user._id,
                avatar: user.avatar,
                login: user.login,
                token: `Bearer ${token}`,
                playLists: user.playLists
            }))
        } else {
            res.send(JSON.stringify('Пароль не верен'))
        }
    } else {
        res.send(JSON.stringify('Login is error'))
    }
})

router.post('/exit', async (req, res) => {
    res.send(JSON.stringify({
        auth: false,
        message: 'Bye bye'
    }))
})

router.post('/delete-account', async (req, res) => {
    const user = await User.findByIdAndDelete({_id: req.body.id})
    res.send(JSON.stringify({
        message: 'Аккаунт удален'
    }))
})


module.exports = router
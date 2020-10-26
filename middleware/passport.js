const {ExtractJwt, Strategy} = require('passport-jwt')
const keys = require('../keys/dev.keys')
const User = require('../models/user')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT
}

module.exports = passport => {
    passport.use(
        new Strategy(options, async (payload, done) => {
            const user = await User.findById(payload.userId).lean()
            if(user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    )
}
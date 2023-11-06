const { authenticate } = require('passport')

const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, pass, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'password incorrect' })
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }), authenticateUser);
    passport.serializeUser((user, done) => { })
    passport.serializeUser((id, done) => { })
}

module.exports = initialize;
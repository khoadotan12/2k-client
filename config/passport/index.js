const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../../models/user');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    userModel.getID(id).then((user) => {
        done(null, user);
    }).catch(function (err) {
        done(err, null);
    })
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        userModel.getEmail(username).then(async (user) => {
            if (!user)
                return done(null, false, req.flash('loginMessage', 'Email hoặc mật khẩu không hợp lệ.'));
            const compare = await bcrypt.compare(password, user.password);
            if (compare) {
                return done(null, user);
            }
            return done(null, false, req.flash('loginMessage', 'Email hoặc mật khẩu không hợp lệ.'));
        }).catch((err) => {
            return done(err);
        })
    }
));

module.exports = passport;
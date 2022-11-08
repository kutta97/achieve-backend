const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (!exUser) {
        done(null, false, { message: 'You are not a member' });
      }
      const result = await bcrypt.compare(password, exUser.password);
      if (!result) {
        done(null, false, { message: 'Wrond password' });
      }
      done(null, exUser);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};


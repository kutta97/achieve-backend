const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.json({'ok' : false, 'message' : 'Already exist'})
    } else {
      const hash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        name,
        password: hash,
      });
      return res.json({'ok' : true, 'message' : 'Sign up success'})
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      return res.json(authError);
    }
    else if (!user) {
      return res.json({'ok' : false, 'message' : info.message});
    } else {
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        const token = jwt.sign({
          id: user.id,
          name: user.name
        }, process.env.JWT_SECRET, {
          expiresIn: '1h',
          issuer: 'achieve',
        })
        return res.json({'ok' : true, 'message' : 'Login success', 'data' : { accessToken : token }});
      });
    }
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
});

module.exports = router;

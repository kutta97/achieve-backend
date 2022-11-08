const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(403).json({'ok' : false, 'message' : 'Login needed'});
  }
  next();
};

exports.isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({'ok' : true, 'message' : 'Already logged in'})
  }
  next();
};

exports.verifyToken = (req, res, next) => {
  console.log('decoded', req.headers);
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        ok: false,
        message: 'Token Expired'
      })
    } else {
      return res.status(401).json({
        ok: false,
        message: 'Invalid Token'
      })
    }
  }
}
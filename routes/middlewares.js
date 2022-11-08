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
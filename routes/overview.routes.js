const express = require('express');

const { verifyToken } = require('./middlewares');

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  return res.json(req.decoded)
});

module.exports = router;
const express = require('express');

const { Goal, User } = require('../models');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const goal = await Goal.create({
      examTitle: reqBody.examTitle,
      scoreType: reqBody.scoreType,
      score: reqBody.score,
      startDate: reqBody.startDate,
      endDate: reqBody.endDate,
      UserId: req.decoded.id,
    })
    return res.json({'ok' : true, 'message' : 'Create post success', data : { goal : goal }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.decoded.id }
    })
    const goals = await user.getGoals();
    return res.json({'ok' : true, 'message' : 'Get post success', data : { goals : goals }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
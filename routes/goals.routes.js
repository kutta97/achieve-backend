const express = require('express');

const { Goal, User } = require('../models');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const goal = await Goal.create({
      examTitle: req.body.examTitle,
      scoreType: req.body.scoreType,
      score: req.body.score,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      UserId: req.body.id,
    })
    return res.json({'ok' : true, 'message' : 'Create post success', data : { goal : goal }});
  } catch (e) {
    console.error(error);
    return next(error);
  }
});

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const goals = await Goal.findAll({
      include: {
        model: User,
        attributes: ['id'],
      },
      order: [['createdAt', 'DESC']],
    })
    return res.json({'ok' : true, 'message' : 'Create post success', data : { goal : goals }});
  } catch (e) {

  }
});

module.exports = router;
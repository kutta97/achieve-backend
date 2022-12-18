const express = require('express');

const { User, Goal } = require('../models');
const { verifyToken } = require('./middlewares');
const { getDateString, getDday } = require('../utils/date')
const { getGoalTitle } = require('../utils/goal');

const { Op } = require("sequelize");

const router = express.Router();

router.get('/goals', verifyToken, async (req, res, next) => {
  try {
    const goals = await Goal.findAll({
      where: {
        userId: req.decoded.id
      },
      order: [
        ['createdAt', 'DESC']
      ],
      attributes: [
        'id', 'examTitle', 'scoreType', 'score', 'startDate', 'endDate', 'status', 'GroupId'
      ],
      limit: 4,
    });

    const data = await Promise.all(goals.map(async (goal) => {
      return ({
        goalId: goal.id,
        title: getGoalTitle(goal.examTitle, goal.scoreType, goal.score),
        period: `${getDateString(goal.startDate)} ~ ${getDateString(goal.endDate)}`,
        dDay: `D${getDday(goal.endDate)}`,
        goalStatus: goal.status,
        isGroupGoal: goal.GroupId ? true : false,
      })
    }))

    return res.json({'ok' : true, 'message' : 'Get overview goals success', data : { goals : data }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

const getActivityItemCount = async (userId) => {
  const today = new Date()
  const todayYear = Number(today.getFullYear());
  const todayMonth = Number(today.getMonth());

  const userCreatedDate = await User.findOne({
    where: {
      id: userId,
    },
    attributes: [
      'createdAt'
    ],
  });
  const signed = new Date(userCreatedDate.createdAt)
  const signedYear = Number(signed.getFullYear());
  const signedMonth = Number(signed.getMonth());

  if (todayYear === signedYear) {
    if (todayMonth < signedMonth) {
      return 0
    }
    return todayMonth - signedMonth + 1;
  }
  if (todayYear > signedYear) {
    return (todayMonth + 1) + (12 - signedMonth);
  }
  return 0;
}

router.get('/activity', verifyToken, async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNumber);
    const itemCount = await getActivityItemCount(req.decoded.id);

    const today = new Date()
    const todayYear = Number(today.getFullYear());
    const todayMonth = Number(today.getMonth());

    if (itemCount <= pageNum) {
      const data = {
        year: todayYear,
        month: todayMonth + 1,
        createdGoals: createdGoals,
        achievedGoals: [],
        gainedBadges: [],
      }
      return res.json({'ok' : true, 'message' : 'Get overview goals success', data : { activities : data, totalItem: itemCount }});
    }

    today.setMonth(todayMonth - pageNum);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const createdGoals = await Goal.findAll({
      where: {
        [Op.and]: [
          { UserId: req.decoded.id, },
          { createdAt: {
            [Op.between]: [firstDay, lastDay],
          }}
        ]
      },
      attributes: [
        'examTitle', 'scoreType', 'score', 'createdAt'
      ],
    })

    const achievedGoals = await Goal.findAll({
      where: {
        [Op.and]: [
          { UserId: req.decoded.id, },
          { createdAt: {
            [Op.between]: [firstDay, lastDay],
          }},
          { status: 'ACHIEVED' }
        ]
      },
      attributes: [
        'examTitle', 'scoreType', 'score', 'achieveDate'
      ],
    })

    const data = {
      year: todayYear,
      month: todayMonth + 1,
      createdGoals: createdGoals.map((goal) => ({
        name: getGoalTitle(goal.examTitle, goal.scoreType, goal.score),
        date: goal.createdAt
      })),
      achievedGoals: achievedGoals.map((goal) => ({
        name: getGoalTitle(goal.examTitle, goal.scoreType, goal.score),
        date: goal.achieveDate
      })),
      gainedBadges: [],
    }

    return res.json({'ok' : true, 'message' : 'Get overview goals success', data : { activities : data, totalItem: itemCount }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
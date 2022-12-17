const express = require('express');

const { Goal, Habit } = require('../models');
const { verifyToken } = require('./middlewares');
const { getDateString, getDday } = require('../utils/date')

const router = express.Router();

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const reqBody = req.body.goal
    const goal = await Goal.create({
      examTitle: reqBody.examTitle,
      scoreType: reqBody.scoreType,
      score: reqBody.score,
      startDate: reqBody.startDate,
      endDate: reqBody.endDate,
      UserId: req.decoded.id,
    })
    return res.json({'ok' : true, 'message' : 'Create goal success', data : { goal : goal }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

const getHabitTrackers = async (goalId) => {
  const habits = await Habit.findAll({
    where: {
      goalId: goalId
    },
    attributes: [
      'id', 'title', 'repeatDays'
    ]
  })
  const habitTrackers = habits.map((habit) => {
    return {
      title: habit.title,
    }
  })
  return habitTrackers;
}

router.get('/', verifyToken, async (req, res, next) => {
  try {
    console.log('goal list rq', req.query)
    const pageNum = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize)
    
    const goals = await Goal.findAll({
      where: {
        userId: req.decoded.id
      },
      order: [
        ['createdAt', 'DESC']
      ],
      attributes: [
        'id', 'examTitle', 'startDate', 'endDate', 'status', 'GroupId'
      ],
      offset: pageNum * pageSize,
      limit: pageSize,
    });

    const data = await Promise.all(goals.map(async (goal) => {
      const habitTrackers = await getHabitTrackers(goal.id)
      return ({
        goalId: goal.id,
        title: goal.examTitle,
        period: `${getDateString(goal.startDate)} ~ ${getDateString(goal.endDate)}`,
        dDay: `D${getDday(goal.endDate)}`,
        isGroupGoal: goal.GroupId ? true : false,
        habitTrackers: habitTrackers,
      })
    }))

    return res.json({'ok' : true, 'message' : 'Get goal list success', data : { goals : data }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
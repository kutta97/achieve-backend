const express = require('express');

const { Goal, Habit, HabitTracker } = require('../models');
const { verifyToken } = require('./middlewares');
const { getDateString, getDday, getTodayDate } = require('../utils/date')

const { Op } = require("sequelize");

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

const getGoalTitle = (goalTitle, scoreType, score) => {
  if (scoreType === 'NUMBER') {
    return `${goalTitle} 시험 ${score}점 이상 받는다!`
  }
  if (scoreType === 'LETTER') {
    return `${goalTitle} 시험 ${score} 이상 받는다!`
  }
  if (scoreType === 'PERCENTAGE') {
    return `${goalTitle} 시험 ${score}% 이상 받는다!`
  }
}

const isTodayHabitDone = async (habitId) => {
  const today = getTodayDate();
  const habitTrackers = await HabitTracker.findOne({
    where: {
      [Op.and]: [
        { HabitId: habitId },
        { compilationDate: String(today) }
      ]
    }
  });
  return habitTrackers ? true : false;
}

const getHabitTrackers = async (goalId) => {
  const habits = await Habit.findAll({
    where: {
      GoalId: goalId
    },
    attributes: [
      'id', 'title', 'repeatDays'
    ]
  })
  const habitTrackers = await Promise.all(habits.map(async (habit) => {
    const isDone = await isTodayHabitDone(habit.id);
    return {
      habitId: habit.id,
      title: habit.title,
      isDone: isDone,
      repeatDays: habit.repeatDays
    }
  }));
  return habitTrackers;
}

router.get('/', verifyToken, async (req, res, next) => {
  try {
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
        'id', 'examTitle', 'scoreType', 'score', 'startDate', 'endDate', 'status', 'GroupId'
      ],
      offset: pageNum * pageSize,
      limit: pageSize,
    });

    const data = await Promise.all(goals.map(async (goal) => {
      const habitTrackers = await getHabitTrackers(goal.id)
      return ({
        goalId: goal.id,
        title: getGoalTitle(goal.examTitle, goal.scoreType, goal.score),
        period: `${getDateString(goal.startDate)} ~ ${getDateString(goal.endDate)}`,
        dDay: `D${getDday(goal.endDate)}`,
        goalStatus: goal.status,
        isGroupGoal: goal.GroupId ? true : false,
        habitTrackers: habitTrackers,
      })
    }))

    return res.json({'ok' : true, 'message' : 'Get goal list success',data : { content : data, pageNumber: pageNum, pageSize: pageSize }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/:id/habits', verifyToken, async (req, res, next) => {
  try {
    const habitTrackers = await getHabitTrackers(req.params.id)
    return res.json({'ok' : true, 'message' : 'Get habit trackers success', data : { habitTrackers : habitTrackers }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/:id/habits', verifyToken, async (req, res, next) => {
  try {
    const reqBody = req.body.habitTracker
    const habit = await Habit.create({
      title: reqBody.title,
      repeatDays: reqBody.repeatDays,
      GoalId: req.params.id
    })
    return res.json({'ok' : true, 'message' : 'Create habit tracker success', data : { habitTracker : habit }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/:id/habits/:habitId', verifyToken, async (req, res, next) => {
  try {
    const isDone = await isTodayHabitDone(req.params.habitId);
    const today = getTodayDate();
    if (isDone) {
      await HabitTracker.destroy({
        where: {
          [Op.and]: [
            { HabitId: req.params.habitId },
            { compilationDate: String(today) }
          ]
        }
      })
      return res.json({'ok' : true, 'message' : 'Cancel Done habit tracker success'});
    }
    const habitTracker = await HabitTracker.create({
      HabitId: req.params.habitId,
      compilationDate: today,
    })
    return res.json({'ok' : true, 'message' : 'Make Done habit tracker success', data : { habitTracker : habitTracker }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/:id/habits/:habitId', verifyToken, async (req, res, next) => {
  try {
    await Habit.destroy({
      where: {
        id: req.params.habitId
      }
    })
    return res.json({'ok' : true, 'message' : 'Delete habit tracker success'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
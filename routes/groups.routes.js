const express = require('express');

const { User, Goal, Group } = require('../models');
const { verifyToken } = require('./middlewares');
const { getDateString, getDday } = require('../utils/date')
const { getGoalTitle } = require('../utils/goal');

const { Op } = require("sequelize");

const router = express.Router();

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const reqBody = req.body.group
    const group = await Group.create({
      name: reqBody.name,
    })
    group.addUser(req.decoded.id)
    return res.json({'ok' : true, 'message' : 'Create group success', data : { goal : group }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

const getGroups = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId
    },
    attributes: [],
    include: [{
      model: Group,
      attributes: [ 'id', 'name' ],
    }],
  });

  return user.Groups.map((it) => ({
    id: it.id,
    name: it.name,
  }))
}

const getGroupMembers = async (groupId) => {
  const group = await Group.findOne({
    where: {
      id: groupId
    },
    attributes: [],
    include: [{
      model: User,
      attributes: [ 'id', 'name', 'profileImageURL' ],
    }]
  })

  return group.Users.map((it) => ({
    id: it.id,
    name: it.name,
    image: it.profileImageURL
  }))
}

const getGroupGoals = async (groupId) => {
  const goals = await Goal.findAll({
    where: {
      groupId: groupId,
    },
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: [
      'id', 'examTitle', 'scoreType', 'score', 'startDate', 'endDate', 'status', 'GroupId'
    ],
  })

  return goals.map((goal) => ({
    goalId: goal.id,
    title: getGoalTitle(goal.examTitle, goal.scoreType, goal.score),
    period: `${getDateString(goal.startDate)} ~ ${getDateString(goal.endDate)}`,
    dDay: `D${getDday(goal.endDate)}`,
  }))
}

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize)

    const groups = await getGroups(req.decoded.id)

    const data = await Promise.all(groups.map(async (group) => {
      const groupMembers = await getGroupMembers(group.id)
      const groupGoals = await getGroupGoals(group.id)
      return ({
        groupId: group.id,
        name: group.name,
        members: groupMembers,
        groupGoals: groupGoals,
      })
    }))
    
    return res.json({'ok' : true, 'message' : 'Get group list success',data : { content : data, pageNumber: pageNum, pageSize: pageSize, totalItem: groups.length }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/:id/goal', verifyToken, async (req, res, next) => {
  try {
    const reqBody = req.body.goal
    const goal = await Goal.create({
      examTitle: reqBody.examTitle,
      scoreType: reqBody.scoreType,
      score: reqBody.score,
      startDate: reqBody.startDate,
      endDate: reqBody.endDate,
      UserId: req.decoded.id,
      GroupId: req.params.id,
    })
    return res.json({'ok' : true, 'message' : 'Create goal success', data : { goal : goal }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
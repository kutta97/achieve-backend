const express = require('express');

const { User, Goal } = require('../models');
const { verifyToken } = require('./middlewares');
const { getDateString, getDday } = require('../utils/date')
const { getGoalTitle } = require('../utils/goal');

const { Op } = require("sequelize");

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize)

    const requestfriends = await User.findOne({
      where: {
        id: req.decoded.id
      },
      attributes: [],
      include: [{
        model: User,
        attributes: [ 'id' ],
        as: 'Request'
      }],
    })

    const acceptedfriends = await User.findOne({
      where: {
        id: req.decoded.id
      },
      attributes: [],
      include: [{
        model: User,
        attributes: [ 'id' ],
        as: 'Accept',
      }],
    })

    // 나에게 친구 요청을 받은 유저 아이디
    const Request = requestfriends.Request.map((it) => {
      return it.id
    })

    // 내가 친구 요청을 보낸 유저 아이디
    const Accept = acceptedfriends.Accept.map((it) => {
      return it.id
    })

    return res.json({'ok' : true, 'message' : 'Get goal list success',data : { content : acceptedfriends, pageNumber: pageNum, pageSize: pageSize, totalItem: 0 }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/request/:id', verifyToken, async (req, res, next) => {
  try {
  
    const user = await User.findOne({where: { id: req.params.id }})

    console.log('user', user)

    if (!user) {
      return res.json({'ok' : false, 'message' : 'Not Existing User'});
    }

    await user.addRequest(req.decoded.id, )
    return res.json({'ok' : true, 'message' : 'Friend rquest success'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/accept/:id', verifyToken, async (req, res, next) => {
  try {
  
    const user = await User.findOne({where: { id: req.params.id }})

    console.log('user', user)

    if (!user) {
      return res.json({'ok' : false, 'message' : 'Not Existing User'});
    }

    await user.addRequest(req.decoded.id, )
    return res.json({'ok' : true, 'message' : 'Friend rquest success'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
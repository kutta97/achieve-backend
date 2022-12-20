const express = require('express');

const { User, Goal } = require('../models');
const { verifyToken } = require('./middlewares');
const { getDateString, getDday } = require('../utils/date')
const { getGoalTitle } = require('../utils/goal');

const { Op } = require("sequelize");

const router = express.Router();

const getRequestedFriends = async (userId) => {
  const requestfriends = await User.findOne({
    where: {
      id: userId
    },
    attributes: [],
    include: [{
      model: User,
      attributes: [ 'id', 'name', 'description', 'profileImageURL' ],
      as: 'Request'
    }],
  })
  // 나에게 친구 요청을 받은 유저 리스트
  return requestfriends.Request.map((it) => ({
    friendId: it.id,
    name: it.name,
    imgSrc: it.profileImageURL,
    description: it.description,
  }))
}

const getAcceptedFriends = async (userId) => {
  const acceptedfriends = await User.findOne({
    where: {
      id: userId
    },
    attributes: [],
    include: [{
      model: User,
      attributes: [ 'id', 'name', 'description', 'profileImageURL' ],
      as: 'Accept',
    }],
  })
  // 내가 친구 요청을 보낸 유저 리스트
  return acceptedfriends.Accept.map((it) => ({
    friendId: it.id,
    name: it.name,
    imgSrc: it.profileImageURL,
    description: it.description,
  }))
}

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize)

    const requests = await getRequestedFriends(req.decoded.id)
    const accepts = await getAcceptedFriends(req.decoded.id)

    const friends = requests.filter((request) => {
      return (accepts.filter((accept) => request.friendId === accept.friendId)).length > 0
    })

    return res.json({
      'ok' : true,
      'message' : 'Get friend list success' ,
      data : {
        content : friends,
        pageNumber: pageNum,
        pageSize: pageSize,
        totalItem: friends.length
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/request', verifyToken, async (req, res, next) => {
  try { 
    const pageNum = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize)

    const requests = await getRequestedFriends(req.decoded.id)
    const accepts = await getAcceptedFriends(req.decoded.id)

    const invites = requests.filter((request) => {
      return (accepts.filter((accept) => request.friendId === accept.friendId)).length === 0
    })

    return res.json({
      'ok' : true,
      'message' : 'Get friend request list success' ,
      data : {
        content : invites,
        pageNumber: pageNum,
        pageSize: pageSize,
        totalItem: invites.length
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/request', verifyToken, async (req, res, next) => {
  try { 
    const email = req.body.email
    const user = await User.findOne({where: { email: email }})

    if (!user) {
      return res.json({'ok' : false, 'message' : 'Not Existing User'});
    }
     if (user.id === req.decoded.id) {
      return res.json({'ok' : false, 'message' : 'Cannot friend request yourself '});
    }
    await user.addRequest(req.decoded.id)
    return res.json({'ok' : true, 'message' : 'Friend rquest success'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/accept/:id', verifyToken, async (req, res, next) => {
  try {  
    const accept = req.body.accept
    const user = await User.findOne({where: { id: req.decoded.id }})

    if (!user) {
      return res.json({'ok' : false, 'message' : 'Not Existing User'});
    }

    if (!accept) {
      await user.removeRequest(req.params.id)
      return res.json({'ok' : true, 'message' : 'Reject friend request success'});
    }
    await user.addAccept(req.params.id)
    return res.json({'ok' : true, 'message' : 'Accept Friend request success'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
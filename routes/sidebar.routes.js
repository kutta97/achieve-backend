const express = require('express');

const { User, Goal, sequelize } = require('../models');
const { verifyToken } = require('./middlewares');

const { Op } = require("sequelize");
const { getGoalTitleSidebar } = require('../utils/goal');

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.decoded.id
      },
      attributes: [
        'name', 'description', 'profileImageURL',
      ],
      include: [{
        model: Goal,
        where: {
          status: 'ACHIEVING'
        },
        order: [
          ['createdAt', 'DESC']
        ],
        attributes: [
          'id', 'examTitle', 'scoreType', 'score'
        ],
        limit: 5,
      }]
    });

    const goalCount = await Goal.count({
      where: {
        [Op.and]: [
          { UserId: req.decoded.id },
          { status: 'ACHIEVING' }
        ]
      }
    })

    const data = {
      name: user.name,
      image: user.profileImageURL,
      description: user.description,
      goalCount: goalCount,
      goalList: user.Goals.map((goal) => {
        return {
          id: goal.id,
          title: getGoalTitleSidebar(goal.examTitle, goal.scoreType, goal.score),
        }
      }),
      badgeCount: 0,
      badgeList: [],
    }

    return res.json({'ok' : true, 'message' : 'Get side bar success', data : { sidebar : data }});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
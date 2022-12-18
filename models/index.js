const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const User = require('./user.model');
const Goal = require('./goal.model');
const Habit = require('./habit.model')
const HabitTracker = require('./habitTracker.model')
const Group = require('./group.model');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Goal = Goal;
db.Habit = Habit;
db.HabitTracker = HabitTracker;
db.Group = Group;

User.init(sequelize);
Goal.init(sequelize);
Habit.init(sequelize);
HabitTracker.init(sequelize);
Group.init(sequelize);

User.associate(db);
Goal.associate(db);
Habit.associate(db);
HabitTracker.associate(db);
Group.associate(db);

module.exports = db;
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const User = require('./user.model');
const Group = require('./group.model');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Group = Group;

User.init(sequelize);
Group.init(sequelize);

User.associate(db);
Group.associate(db);

module.exports = db;
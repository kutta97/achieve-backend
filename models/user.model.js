const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      profileImageURL: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
    });
  }

  static associate(db) {
    this.belongsToMany(db.User, {
      foreignKey: 'userId',
      as: 'friends',
      through: 'UsersFriends',
    });
    this.belongsToMany(db.User, {
      foreignKey: 'friendId',
      as: 'userFriends',
      through: 'UsersFriends',
    });
    this.belongsToMany(db.Group, {
      through: 'GroupsUsers',
    })
  }
};

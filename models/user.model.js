const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      profileImageURL: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
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
      as: 'Request',
      through: 'Friend',
    });
    this.belongsToMany(db.User, {
      foreignKey: 'friendId',
      as: 'Accept',
      through: 'Friend',
    });
    this.hasMany(db.Goal);
    this.belongsToMany(db.Group, {
      through: 'GroupsUsers',
    });
  }
};

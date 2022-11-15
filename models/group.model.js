const Sequelize = require('sequelize');

module.exports = class Group extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Group',
      tableName: 'groups',
      paranoid: true,
    });
  }

  static associate(db) {
    this.belongsToMany(db.User, {
      through: 'GroupsUsers',
    });
    this.hasMany(db.Goal);
  }
};

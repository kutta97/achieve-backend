const Sequelize = require('sequelize');

module.exports = class HabitTracker extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      compilationDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'HabitTracker',
      tableName: 'habitTrackers',
      paranoid: true,
    });
  }

  static associate(db) {
    this.belongsTo(db.Habit);
  }
};
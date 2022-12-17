const Sequelize = require('sequelize');

module.exports = class Habit extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      repeatDays: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Habit',
      tableName: 'habits',
      paranoid: true,
    });
  }

  static associate(db) {
    this.belongsTo(db.Goal);
    this.hasMany(db.HabitTracker);
  }
};
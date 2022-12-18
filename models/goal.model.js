const Sequelize = require('sequelize');

module.exports = class Goal extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      examTitle: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      scoreType: {
        type: Sequelize.ENUM('NUMBER', 'LETTER', 'PERCENTAGE'),
        allowNull: false,
      },
      score: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('ACHIEVING', 'ACHIEVED', 'FAILED'),
        defaultValue: 'ACHIEVING',
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      achieveDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      sequelize,
      modelName: 'Goal',
      tableName: 'goals',
      paranoid: true,
    });
  }

  static associate(db) {
    this.belongsTo(db.User);
    this.belongsTo(db.Group);
    this.hasMany(db.Habit, { onDelete: 'cascade' })
  }
};
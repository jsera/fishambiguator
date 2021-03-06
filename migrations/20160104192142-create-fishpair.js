'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('fishpairs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fish1: {
        type: Sequelize.INTEGER,
        references: {
          model: "fishes",
          key: "id"
        }
      },
      fish2: {
        type: Sequelize.INTEGER,
        references: {
          model: "fishes",
          key: "id"
        }
      },
      fishuniqueId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('fishpairs');
  }
};
'use strict';
module.exports = function(sequelize, DataTypes) {
  var fishpair = sequelize.define('fishpair', {
    fish1: DataTypes.INTEGER,
    fish2: DataTypes.INTEGER,
    fishuniqueId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fishpair.belongsTo(models.fish, {
          foreignKey: "fish1"
        });
        models.fishpair.belongsTo(models.fish, {
          foreignKey: "fish2"
        });
        models.fishpair.belongsTo(models.fishpairunique);
      },
      newPair: function() {
        // Reverse pairs defined/enforced here
      }
    }
  });
  return fishpair;
};
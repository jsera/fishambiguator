'use strict';
var beforeCreateOrUpdate = function(pair, options) {
  // fish1 should always be the lower numbered ID
  var lowerId = pair.fish1;
  var higherId = pair.fish2;
  if (lowerId > higherId) {
    pair.fish1 = higherId;
    pair.fish2 = lowerId;
  }
};

module.exports = function(sequelize, DataTypes) {
  var fishpair = sequelize.define('fishpair', {
    fish1: DataTypes.INTEGER,
    fish2: DataTypes.INTEGER
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
      },
      newPair: function(fishId1, fishId2) {
        
      }
    },
    hooks: {
      beforeCreate: beforeCreateOrUpdate,
      beforeUpdate: beforeCreateOrUpdate
    }
  });
  return fishpair;
};
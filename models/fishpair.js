'use strict';
/**
  We're enforcing unique pairs by ensureing that fish1 is always the lower of the two IDs, and
  fish2 is always the higher. This enforcement happens in the hooks below. 
*/
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
      beforeUpdate: beforeCreateOrUpdate,
      beforeFind: function(opts, fn) {
        if (opts.where) {
          if (opts.where.fish1 && opts.where.fish2) {
            var lowerId = parseInt(opts.where.fish1);
            var higherId = parseInt(opts.where.fish2);
            if (!isNaN(lowerId) && !isNaN(higherId)) {
              if (lowerId > higherId) {
                opts.fish1 = higherId;
                opts.fish2 = lowerId;
              }
            }
          }
        }
        return fn(null, opts);
      }
    }
  });
  return fishpair;
};
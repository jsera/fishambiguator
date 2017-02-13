'use strict';
var db = require("./");
var promiseLib = require("../promiseLib/");
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
        models.fishpair.hasMany(models.fishpair_comment);
        models.fishpair.belongsTo(models.fish, {
          foreignKey: "fish1"
        });
        models.fishpair.belongsTo(models.fish, {
          foreignKey: "fish2"
        });
      },
      newPair: function(fishId1, fishId2) {
        var promiseHolder = promiseLib.getPromiseHolder();
        if (!isNaN(fishId1) && !isNaN(fishId2)) {
          this.findOrCreate({
            where: {
              fish1: fishId1,
              fish2: fishId2
            }
          }).spread(function(pair, created) {
            if (pair) {
              promiseHolder.callback(pair);
            } else {
              promiseHolder.error("Pair wasn't created!");
            }
          });
        } else {
          promiseHolder.error("Bad IDs, fish1:"+fishId1+", fish2:"+fishId2);
        }
        return promiseLib.getPromise(promiseHolder);
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
                opts.where.fish1 = higherId;
                opts.where.fish2 = lowerId;
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
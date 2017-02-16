'use strict';
var db = require("./");
var promiseLib = require("../promiseLib/");

module.exports = function(sequelize, DataTypes) {
  var Pair = sequelize.import("./fishpair");
  var fishpair_comment = sequelize.define('fishpair_comment', {
    fishpairId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fishpair_comment.belongsTo(models.fishpair);
        models.fishpair_comment.belongsTo(models.user);
      },
      newComment: function(params) {
        var promiseHolder = promiseLib.getPromiseHolder();
        var scope = this;
        if (!isNaN(params.fish1) && !isNaN(params.fish2) && !isNaN(params.userId)) {
          Pair.newPair(params.fish1, params.fish2).then(function(pair) {
            scope.create({
              fishpairId: pair.id,
              userId: params.userId,
              text: params.text
            }).then(function(comment, created) {
              promiseHolder.callback(comment);
            });
          }).error(function(err) {
            promiseHolder.error(err);
          });
        } else {
          promiseHolder.error("Fish IDs, or user ID isn't valid!");
        }
        return promiseLib.getPromise(promiseHolder);
      }
    }
  });
  return fishpair_comment;
};
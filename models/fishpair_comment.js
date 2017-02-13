'use strict';
var db = require("./");
var promiseLib = require("../promiseLib/");

module.exports = function(sequelize, DataTypes) {
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
        if (!isNaN(params.fish1)) {

        }
      }
    }
  });
  return fishpair_comment;
};
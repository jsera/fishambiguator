'use strict';
var promiseLib = require("../promiseLib/");

module.exports = function(sequelize, DataTypes) {
  var fishpic = sequelize.define('fishpic', {
    url: DataTypes.STRING,
    fishId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    caption: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fishpic.belongsTo(models.fish);
        models.fishpic.belongsTo(models.user);
      },
      newPic: function(data) {
        var promiseHolder = promiseLib.getPromiseHolder();
        if (data.url && data.fishId && data.userId) {
          this.findOrCreate({
            where: {
              url: data.url,
              fishId: data.fishId,
              userId: data.userId
            }
          }).spread(function(pic, created) {
            if (data.caption) {
              pic.caption = data.caption;
              pic.save().then(function() {
                promiseHolder.callback(pic);
              });
            } else {
              promiseHolder.callback(pic);
            }
          }).error(function(err) {
            promiseHolder.error(err);
          });
        } else {
          promiseHolder.error("new pic requires a url, fish id and a user id");
        }
        return promiseLib.getPromise(promiseHolder);
      }
    }
  });
  return fishpic;
};
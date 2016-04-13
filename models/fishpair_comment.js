'use strict';
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
      }
    }
  });
  return fishpair_comment;
};
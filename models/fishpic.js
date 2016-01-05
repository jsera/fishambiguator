'use strict';
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
      }
    }
  });
  return fishpic;
};
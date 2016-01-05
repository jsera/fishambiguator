'use strict';
module.exports = function(sequelize, DataTypes) {
  var commonname = sequelize.define('commonname', {
    name: DataTypes.STRING,
    fishId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.commonname.belongsTo(models.fish);
      }
    }
  });
  return commonname;
};
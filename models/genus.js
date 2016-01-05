'use strict';
module.exports = function(sequelize, DataTypes) {
  var genus = sequelize.define('genus', {
    name: DataTypes.STRING,
    familyId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.genus.hasMany(models.fish);
      }
    }
  });
  return genus;
};
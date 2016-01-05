'use strict';
module.exports = function(sequelize, DataTypes) {
  var fish = sequelize.define('fish', {
    species: DataTypes.STRING,
    genusId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fish.hasMany(models.fishpair);
        models.fish.hasMany(models.commonname);
        models.fish.hasMany(models.fishpic);
        models.fish.belongsTo(models.genus);
      }
    }
  });
  return fish;
};
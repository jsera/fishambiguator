'use strict';
module.exports = function(sequelize, DataTypes) {
  var fishpairunique = sequelize.define('fishpairunique', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fishpairunique.hasMany(models.fishpair);
        models.fishpairunique.hasMany(models.fishpair_comment);
      }
    }
  });
  return fishpairunique;
};
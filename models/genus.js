'use strict';
module.exports = function(sequelize, DataTypes) {
  var genus = sequelize.define('genus', {
    name: DataTypes.STRING,
    familyId: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    name: {
      singular: "genus",
      plural: "genus"
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.genus.hasMany(models.fish, {foreignKey:"genusId"});
      }
    }
  });
  return genus;
};
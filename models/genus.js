'use strict';

var beforeCreateOrUpdate = function(genus, options) {
  if (genus.name) {
    genus.name = genus.name.toLowerCase();
  }
}

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
    },
    instanceMethods: {

    },
    hooks: {
      beforeCreate: beforeCreateOrUpdate,
      beforeUpdate: beforeCreateOrUpdate,
      beforeFind: function(options, fn) {
        console.log("*********** before find!", arguments);
        if (options.where) {
          if (options.where.name) {
            options.where.name = options.where.name.toLowerCase()
          }
        }
        return fn(null, options);
      }
    }
  });
  return genus;
};
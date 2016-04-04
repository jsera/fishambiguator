'use strict';
var db = require("./");
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
        models.fish.belongsTo(models.genus, {foreignKey: "genusId"});
      }
    },
    instanceMethods: {
      setScientificName: function(name, callback, errCallback) {
        // currently, just genus and species
        // split name to get genus and species
        var scope = this;
        if (name.toLowerCase) {
          var parts = name.split(" ");
          if (parts.length == 2) {
            // set species name directly on fish
            this.species = parts[1];
            // findOrCreate on genus name
            var Genus = sequelize.import("./genus");
            Genus.findOrCreate({
              where: {
                name: parts[0]
              }
            }).spread(function(genus, created) {
              if (genus) {
                scope.setGenus(genus.id);
                scope.save();
                if (callback) {
                  callback(scope);
                }
              } else {
                errCallback("Problem saving genus!");
              }
            });
          } else {
            errCallback("This is not a proper scientific name: "+name);
          }
        } else {
          errCallback("Tried to set scientific name to something that's not a string!");
        }
      },
      getScientificName: function(callback) {
          if (this.genus) {
            return this.genus.name+" "+this.species;
          } else {
            throw new Error("Fish model requires you to eagerly load genus, or provide a callback when you want to call getScientificName");
          }
      }
    }
  });
  return fish;
};
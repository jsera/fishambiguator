'use strict';
var db = require("./");

var testScientificName = function(name) {
  if (name.split) {
    var parts = name.split(" ");
    return parts.length == 2;
  } else {
    return false;
  }
};

var trimCommonNames = function(fish) {
  if (fish.commonnames) {
    var parts = fish.commonnames.split(",");
    parts = parts.map(function(name) {
      return name.trim().toLowerCase();
    });
    fish.commonnames = parts.join(",");
  }
};

module.exports = function(sequelize, DataTypes) {
  var fish = sequelize.define('fish', {
    species: DataTypes.STRING,
    genusId: DataTypes.INTEGER,
    commonnames: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.fish.hasMany(models.fishpair);
        models.fish.hasMany(models.fishpic);
        models.fish.belongsTo(models.genus, {foreignKey: "genusId"});
      },
      testScientificName: testScientificName
    },
    instanceMethods: {
      setScientificName: function(name, callback, errCallback) {
        // currently, just genus and species
        // split name to get genus and species
        var scope = this;
        if (testScientificName(name)) {
          var parts = name.split(" ");
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
          throw new Error("This is not a proper scientific name: "+name);
        }
      },
      getScientificName: function(callback) {
        var scope = this;
        if (callback && typeof(callback) == "function") {
          this.getGenus().then(function(genus) {
            callback(genus.name+" "+scope.species);
          });
        } else {
          // Better hope you eagerly loaded the genus
          if (this.genus) {
            return this.genus.name+" "+this.species;
          } else {
            throw new Error("Fish model requires you to eagerly load genus, or provide a callback when you want to call getScientificName");
          }
        }
      }
    },
    hooks: {
      beforeCreate:function(fish, options) {
        trimCommonNames(fish);
      },
      beforeUpdate: function(fish, options) {
        trimCommonNames(fish);
      }
    }
  });
  return fish;
};
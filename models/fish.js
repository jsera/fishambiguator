'use strict';
var db = require("./");
var promiseLib = require("../promiseLib/");

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
      testScientificName: testScientificName,
      newFish: function(params, callback) {
        if (params.commonnames && params.scientificName) {
          this.create({
            commonnames: params.commonnames
          }).then(function(fish) {
            if (fish) {
              fish.setScientificName(params.scientificName).then(function(fish) {
                callback(fish);
              });
            } else {
              callback(null, "Fish wasn't created");
            }
          });
        } else {
          // params no formatted right
          callback(null, "Params not formatted right");
        }
      }
    },
    instanceMethods: {
      setScientificName: function(name) {
        // currently, just genus and species
        // split name to get genus and species
        var scope = this;
        if (testScientificName(name)) {
          var promiseHolder = promiseLib.getPromiseHolder();
          var parts = name.split(" ").map(function(part) {
            return part.toLowerCase();
          });
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
              if (promiseHolder.callback) {
                promiseHolder.callback(scope);
              }
            } else {
              promiseHolder.error("Problem saving genus!");
            }
          });
          return promiseLib.getPromise(promiseHolder);
        } else {
          throw new Error("This is not a proper scientific name: "+name);
        }
      },
      // returns scientific name if genus is eagerly loaded, or a promise if not.
      getScientificName: function() {
        var scope = this;
        var promiseHolder = promiseLib.getPromiseHolder();
        if (!this.genus) {
          this.getGenus().then(function(genus) {
            promiseHolder.callback(genus.name+" "+scope.species);
          });
          return promiseLib.getPromise(promiseHolder);
        } else {
          // Better hope you eagerly loaded the genus
          return this.genus.name+" "+this.species;
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
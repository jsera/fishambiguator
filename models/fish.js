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

var beforeCreateOrUpdate = function(fish, options) {
  trimCommonNames(fish);
  if (fish.species) {
    fish.species = fish.species.toLowerCase();
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
      /*
        params:
          string commonnames - a comma delimited list of common names
          string scientificname - the scientific name, (genus species) ex: "ophidon elongatus"
      */
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
      },
      /*
        params:
          string commonnames - a comma delimited list of common names
          string scientificname - the scientific name, (genus species) ex: "ophidon elongatus"
      */
      updateFish: function(id, params) {
        var promiseHolder = promiseLib.getPromiseHolder();
        var scope = this;
        if (params.commonnames || params.scientificname) {
          var Genus = sequelize.import("./genus");
          this.findOne({
            where: {
              id: id
            },
            include: [Genus]
          }).then(function(fish) {
            if (fish) {
              var finalFishLoad = function() {
                scope.findOne({
                  where: {
                    id: fish.id
                  },
                  include: [Genus]
                }).then(function(finalFish) {
                  promiseHolder.callback(finalFish);
                });
              };
              // Deal with common names
              if (params.commonnames) {
                fish.commonnames = params.commonnames;
              }
              if (params.scientificname && testScientificName(params.scientificname)) {
                var parts = params.scientificname.split(" ");
                var originalGenusId = fish.genus.id;
                Genus.findOrCreate({
                  where: {
                    name: parts[0]
                  }
                }).spread(function(genus, created) {
                  if (genus && originalGenusId != genus.id) {
                    fish.genusId = genus.id;
                  }
                  fish.species = parts[1];
                  fish.save().then(function() {
                    finalFishLoad();
                  });
                });
              } else {
                fish.save().then(function() {
                  finalFishLoad();
                });
              }
            }
          });
        } else {
          promiseHolder.error("No data to update with!");
        }
        return promiseLib.getPromise(promiseHolder);
      },
      findByScientificName: function(name) {
        var promiseHolder = promiseLib.getPromiseHolder();
        var scope = this;
        if (name && testScientificName(name)) {
          var nameParts = name.split(" ");
          var Genus = sequelize.import("./genus");
          Genus.find({
              where: {
                  name: nameParts[0]
              }
          }).then(function(genus) {
              if (genus) {
                  scope.findAll({
                      where: {
                          species: nameParts[1],
                          genusId: genus.id
                      },
                      include: [Genus]
                  }).then(function(fish) {
                      promiseHolder.callback(fish);
                  });
              } else {
                  promiseHolder.callback(fish);
              }
          });
        } else {
          promiseHolder.error("Not a proper scientific name!");
        }
        return promiseLib.getPromise(promiseHolder);
      },
      // Does a like, so you could search for "Ling" and get "Ling Cod"
      findByCommonName: function(name) {
        var promiseHolder = promiseLib.getPromiseHolder();
        if (name && name.toLowerCase) {
          var Genus = sequelize.import("./genus");
          this.findAll({
            where: {
                commonnames: {
                    $like: "%"+name+"%"
                }
            },
            include: [Genus]
          }).then(function(fish) {
              promiseHolder.callback(fish);
          });
        } else {
          promiseHolder.error("Not a valid common name");
        }
        return promiseLib.getPromise(promiseHolder);
      }
    },
    instanceMethods: {
      setScientificName: function(name) {
        // currently, just genus and species
        // split name to get genus and species
        var scope = this;
        if (testScientificName(name)) {
          var promiseHolder = promiseLib.getPromiseHolder();
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
      beforeCreate: beforeCreateOrUpdate,
      beforeUpdate: beforeCreateOrUpdate,
      beforeFind: function(opts, fn) {
        if (opts.where) {
          if (opts.where.species) {
            opts.where.species = opts.where.species.toLowerCase();
          }
          if (opts.where.commonnames) {
            if (opts.where.commonnames.toLowerCase) {
              opts.where.commonnames = opts.where.commonnames.toLowerCase();
            } else {
              if (opts.where.commonnames.$like) {
                opts.where.commonnames.$like = opts.where.commonnames.$like.toLowerCase();
              }
            }
          }
        }
        return fn(null, opts);
      }
    }
  });
  return fish;
};
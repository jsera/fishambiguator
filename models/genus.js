'use strict';
var promiseLib = require("../promiseLib/");

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
      },
      findByFirstLetter: function(letter) {
        var promiseHolder = promiseLib.getPromiseHolder();
        if (letter.length == 1 && letter.toLowerCase) {
          this.findAll({
            where: {
              name: {
                $like: letter+"%"
              }
            }
          }).then(function (genus) {
            promiseHolder.callback(genus);
          });
        } else {
          promiseHolder.error("Invalid letter!");
        }
        return promiseLib.getPromise(promiseHolder);
      }
    },
    instanceMethods: {

    },
    hooks: {
      beforeCreate: beforeCreateOrUpdate,
      beforeUpdate: beforeCreateOrUpdate,
      beforeFind: function(options, fn) {
        if (options.where) {
          if (options.where.name && options.where.name.toLowerCase) {
            options.where.name = options.where.name.toLowerCase();
          } else if (options.where.name && options.where.name.$like) {
            if (options.where.name.$like.toLowerCase) {
              options.where.name.$like = options.where.name.$like.toLowerCase();
            } else if (opts.where.commonnames.$like.$any) {
              opts.where.commonnames.$like.$any = opts.where.commonnames.$like.$any.map(function(clause) {
                return clause.toLowerCase();
              });
            }
          }
        }
        return fn(null, options);
      }
    }
  });
  return genus;
};
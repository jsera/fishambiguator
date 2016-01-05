'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    displayname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.belongsToMany(models.role, {
          through: models.usersRoles,
          foreignKey:"userId"
        });
        models.user.hasMany(models.authprovider);
        models.user.hasMany(models.fishpair_comment);
        models.user.hasMany(models.fishpic);
      }
    },
    instanceMethods: {
      hasRoleName: function(roleName) {
        var l = this.roles.length;
        for (var i=0;i<l;++i) {
          if (this.roles[i].name === roleName) {
            return true;
          }
        }
        return false;
      }
    }
  });
  return user;
};
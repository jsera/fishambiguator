'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersRoles = sequelize.define('usersRoles', {
    userId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersRoles;
};
'use strict';
module.exports = function(sequelize, DataTypes) {
  var role = sequelize.define('role', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.role.belongsToMany(models.user, {
          through: models.usersRoles,
          foreignKey: "roleId"
        });
      }
    }
  });
  return role;
};
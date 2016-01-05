'use strict';

var constants = require("../constants.js");

module.exports = function(sequelize, DataTypes) {
  var authprovider = sequelize.define('authprovider', {
    source: DataTypes.STRING,
    provider_user_id: DataTypes.STRING,
    auth_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    json: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.authprovider.belongsTo(models.user);
      },
      createOrUpdate: function(accessToken, refreshToken, profile, done) {
        // Facebook gives you a unique userId, so we store that, and associate it with
        // the actual user row.
        this.findOrCreate({
          where:{
            source:constants.AUTH_FACEBOOK,
            provider_user_id: profile.id
          },
          defaults: {
            source:constants.AUTH_FACEBOOK,
            provider_user_id: profile.id
          },
          include: [sequelize.models.user]
        }).spread(function(authprovider, created) {
          // Once we find or create the auth provider, we see if it has a user.
          authprovider.auth_token = accessToken;
          authprovider.refresh_token = refreshToken;
          authprovider.json = JSON.stringify(profile);
          authprovider.save().then(function(authprovider) {
            // Do we have a user?
            if (authprovider.user == null) {
              authprovider.createUserWithRole(authprovider, profile, done);
            } else {
              console.log("Auth provider already has a user!");
              done(null, authprovider.user.get());
            }
          });
        }).catch(function (err) {
          console.log("Error logging into FB", err);
          done(err, null);
        });
      }
    },
    instanceMethods: {
      createUserWithRole: function(authprovider, profile, done) {
        authprovider.createUser({
          displayname: profile.displayName
        }).then(function(user) {
          console.log("Created a new user!");
          // default the user to the "user" role
          sequelize.models.role.find({
            where: {
              name:constants.ROLE_USER
            }
          }).then(function(role) {
            console.log("Found the role!");
            role.addUser(user.id).then(function(role, err) {
              console.log("Done with association!", err);
              done(null, user.get());
            }).catch(function(err) {
              console.log("Problem adding role to user", err);
              done(err, null);
            });
            console.log("Will this log?");
          }).catch(function(err) {
            console.log("Problem finding role", err);
            done(err, null);
          });
        }).catch(function(err) {
          done(err, null);
        });
      }
    }
  });
  return authprovider;
};
var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('../models');
var constants = require("../constants");

module.exports = {
  serializeUser: function(user, done) {
    done(null, user.id);
  },
  deserializeUser: function(id, done) {
    db.user.find({
      where: {
        id:id
      },
      include: [db.role]
    }).then(function(user) {
      if (user) {
        done(null, user);
      } else {
        done("User not found!", null);
      }
    }).catch(function(err) {
      done(err, null);
    });
  },
  facebookStrategy: new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.BASE_URL + '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      // Do we have an authprovider row?
      db.authprovider.createOrUpdate(accessToken, refreshToken, profile, done);
    }
  )
};
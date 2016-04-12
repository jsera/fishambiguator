module.exports = {
	hasRoleExclusive: function(roleName, error) {
		var restrict = function(req, res, next) {
			if (req.user) {
		        if (req.user.hasRoleName(roleName)) {
		            next();
		        } else {
		            error(req, res);
		        }
		    } else {
		        error(req, res);
		    }
		}
		restrict.unless = require("express-unless");
		return restrict;
	},
	hasRoleSynchronous: function(req, roleName) {
		return req.user && req.user.hasRoleName(roleName);
	},
	hasRoleRoute: function(roleName, success, error) {
		return function(req, res) {
			if (req.user && req.user.hasRoleName(roleName)) {
				success(req, res);
			} else {
				error(req, res);
			}
		};
	},
	sendNotLoggedIn: function(req, res) {
		res.status(403).send({error:"You need to be logged in to do that!"});
	}
};
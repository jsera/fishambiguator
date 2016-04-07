module.exports = {
	hasRoleExclusive: function(roleName, error) {
		return function(req, res, next) {
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
	},
	hasRoleSynchronous: function(req, roleName) {
		return req.user && req.user.hasRoleName(roleName);
	},
	sendNotLoggedIn: function(res) {
		res.status(403).send({error:"You need to be logged in to do that!"});
	}
};
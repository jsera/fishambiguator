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
	}
};
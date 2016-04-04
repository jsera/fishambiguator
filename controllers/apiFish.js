var express = require("express");
var router = express.Router();

// Editors only!
router.use(function(req, res, next) {
	// TODO: Check for jwt tokens as well as a currently logged-in user
    if (req.user) {
        if (req.user.hasRoleName(constants.ROLE_EDITOR)) {
            next();
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

router.post("/", function(req, res) {

});

module.exports = router;
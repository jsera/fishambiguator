var express = require("express");
var router = express.Router();
var constants = require("../constants");

// Editors only!
router.use(function(req, res, next) {
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

router.get("/add", function(req, res) {
	res.render("fish/add", {fish:{}});
});

router.post("/", function(req, res) {
	// redirect to edit fish
	res.redirect("/");
});

module.exports = router;
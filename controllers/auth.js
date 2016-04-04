var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/facebook", passport.authenticate("facebook"));

router.get("/facebook/callback", function(req, res) {
	console.log("At callback?");
	passport.authenticate("facebook", {
	    successRedirect: "/",
	    failureRedirect: "/auth/error"
	})(req, res);
});

router.get("/error", function(req, res) {
	console.log("Got to error route");
    res.render("login_error");
});

module.exports = router;
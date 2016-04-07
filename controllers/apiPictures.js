var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

router.post("/", function(req, res) {
	//if (accessControl.hasRoleSynchronous(constants.ROLE_EDITOR)) {
	if (true) {
		db.fishpic.newPic(req.body).then(function(pic) {
			res.send(pic);
		}).error(function(err) {
			res.send({
				error: err
			});
		});
	} else {
		accessControl.sendNotLoggedIn(res);
	}
});

module.exports = router;
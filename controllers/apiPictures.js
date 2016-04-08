var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, accessControl.sendNotLoggedIn).unless({
	method: "GET"
}));

router.post("/", function(req, res) {
	if (accessControl.hasRoleSynchronous(constants.ROLE_EDITOR)) {
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

router.put("/:id", function(req, res) {
	
});

router.delete("/:id", function(req, res) {

});

module.exports = router;
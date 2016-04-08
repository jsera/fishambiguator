var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, accessControl.sendNotLoggedIn).unless({
	method: ["GET", "PUT"]
}));

router.post("/", function(req, res) {
	db.fishpic.newPic(req.body).then(function(pic) {
		res.send(pic);
	}).error(function(err) {
		res.send({
			error: err
		});
	});
});

router.put("/:id", function(req, res) {
	var id = parseInt(req.params.id);
	if (!isNaN(id)) {
		db.fishpic.updatePic(id, req.body).then(function(pic) {
			res.send(pic);
		}).error(function(err) {
			res.send({error:err});
		});
	} else {
		res.send({error: "Not a valid ID"});
	}
});

router.delete("/:id", function(req, res) {

});

module.exports = router;
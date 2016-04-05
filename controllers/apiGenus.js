var express = require("express");
var router = express.Router();
var db = require("../models/");

router.get("/", function(req, res) {
	var predicate = {
		order: "name"
	};
	if (req.query.name) {
		predicate.where = {
			name: {
				$like: "%"+req.query.name+"%"
			}
		};
	}
	db.genus.findAll(predicate).then(function(genera) {
		var result = genera.map(function(genus) {
			return genus.get();
		});
		res.send({results:result});
	});
});

router.get("/:id", function(req, res) {
	var id = parseInt(req.params.id);
	if (!isNaN(id)) {
		db.genus.find({
			where: {
				id: id
			},
			include: [db.fish]
		}).then(function(genus) {
			res.send(genus.get());
		});
	} else {
		res.send({error:"Bad genus ID"});
	}
});

module.exports = router;
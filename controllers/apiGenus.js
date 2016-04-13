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

router.get("/autocomplete", function(req, res) {
	// Oh god, so much hassle because of circular dependencies!
	var q = req.query.q;
    if (q && q.toLowerCase) {
    	q = q.toLowerCase();
    	db.fish.findGenusAutocomplete(q, db.genus).then(function(genera) {
    		var fishname = q.toLowerCase().split(" ")[1];
    		var result = [];
    		var simpleGenera = [];
    		genera.forEach(function(genus) {
    			simpleGenera.push(genus.get());
    		});
    		simpleGenera.forEach(function(genus) {
    			var fishes = genus.fishes;
    			genus.fishes = null;
    			if (fishname) {
    				fishes.forEach(function(fish) {
    					fish = fish.get();
    					if (fish.species.indexOf(fishname) == 0) {
	    					fish.genus = genus;
	    					result.push(fish);
	    				}
    				});
    			} else {
    				fishes.forEach(function(fish) {
    					fish = fish.get();
    					fish.genus = genus;
    					result.push(fish);
    				});
    			}
    		});
    		res.send(result);
    	});
    } else {
        res.send({message:"No query specified"});
    }
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
var express = require("express");
var router = express.Router();
var db = require("../models/");

router.get("/", function(req, res) {
    if (req.query.scientificname || req.query.commonname) {
        if (req.query.scientificname && db.fish.testScientificName(req.query.scientificname)) {
            var nameParts = req.query.scientificname.split(" ");
            db.genus.find({
                where: {
                    name: nameParts[0]
                }
            }).then(function(genus) {
                if (genus) {
                    genus.getFishes({
                        where: {
                            species: nameParts[1]
                        }
                    }).then(function(fish) {
                        if (fish && fish.length) {
                            result = fish.map(function(aFish) {
                                return aFish.get();
                            });
                            res.send({
                                results: result
                            });
                        } else {
                            res.send({
                                error: "No fish for that name found"
                            });
                        }
                    });
                } else {
                    res.send({
                        error: "No fish for that name found"
                    });
                }
            });
        } else {
            db.fish.findAll({
                where: {
                    commonnames: {
                        $like: "%"+req.query.commonname+"%"
                    }
                },
                include: [db.genus]
            }).then(function(fish) {
                if (fish && fish.length) {
                    var result = fish.map(function(aFish) {
                        return aFish.get();
                    });
                    res.send({
                        results: result
                    });
                } else {
                    res.send({
                        error: "No fish for that name found"
                    });
                }
            });
        }  
    } else {
        res.send({error:"Must specify a query! We have a lot of fish."});
    }
});

module.exports = router;
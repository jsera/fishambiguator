var express = require("express");
var router = express.Router();
var db = require("../models/");

router.get("/", function(req, res) {
    if (req.query.scientificname || req.query.commonname) {
        if (req.query.scientificname && db.fish.testScientificName(req.query.scientificname)) {
            db.fish.findByScientificName(req.query.scientificname)
                .then(function(fish) {
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
            db.fish.findByCommonName(req.query.commonname).then(function(fish) {
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
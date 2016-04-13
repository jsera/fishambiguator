var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, accessControl.sendNotLoggedIn).unless({
    method: "GET"
}));

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
                }).error(function(error) {
                    res.send({
                        error: error
                    });
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
            }).error(function(error) {
                res.send({
                    error: error
                });
            });
        }  
    } else {
        res.send({error:"Must specify a query! We have a lot of fish."});
    }
});

router.get("/autocomplete", function(req, res) {
    var q = req.query.q;
    if (q) {
        db.fish.findCommonNameAutocomplete(q).then(function(results) {
            var simpleResults = results.map(function(fish) {
                return fish.get();
            });
            var results = [];
            simpleResults.forEach(function(fish) {
                var commonnames = fish.commonnames.split(",");
                commonnames.forEach(function(name) {
                    if (name.indexOf(q) == 0) {
                        fish.namematch = name;
                        results.push(fish);
                    }
                });
            });
            res.send(results);
        }).error(function(err) {
            res.send({error:err});
        });
    } else {
        res.send({message:"No query specified"});
    }
});

router.get("/:id", function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        var query = db.fish.getGenericQuery();
        query.where = {
            id: id
        };
        db.fish.findOne(query).then(function(fish) {
            if (fish) {
                res.send(fish.get());
            } else {
                res.send({
                    error: "No fish by that ID"
                });
            }
        });
    } else {
        res.send({
            error: "That's not a proper ID"
        });
    }
});

router.put("/:id", function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        console.log("********** Has a body?", req.body);
        db.fish.updateFish(id, req.body).then(function(fish) {
            console.log("******* Fish updated?");
            res.send(fish.get());
        }).error(function(err) {
            res.status(500).send({error:err});
        });
    } else {
        res.status(500).send({error: "Not a valid ID"});
    }
});

router.delete("/:id", function(req, res) {
    res.send({message:"Not implemented yet"});
});

module.exports = router;
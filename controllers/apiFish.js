var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

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

router.get("/:id", function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        db.fish.findOne({
            where: {
                id: id
            },
            include: [db.genus]
        }).then(function(fish) {
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
    if (accessControl.hasRoleSynchronous(req, constants.ROLE_EDITOR)) {
        var id = parseInt(req.params.id);
        if (!isNaN(id)) {
            db.fish.updateFish(id, req.body).then(function(fish) {
                res.send(fish.get());
            });
        } else {
            res.status(500).send({error: "Not a valid ID"});
        }
    } else {
        res.status(403).send({error:"You need to be logged in to do that!"});
    }
});

module.exports = router;
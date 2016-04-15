var express = require("express");
var router = express.Router();
var constants = require("../constants");
var db = require("../models/");
var accessControl = require("../accessControl");

// Editors only!
var errorRedirect = function(req, res) {
    res.redirect("/");
};

router.get("/add", accessControl.hasRoleRoute(constants.ROLE_EDITOR, function(req, res) {
	res.render("fish/add", {fish:{}});
}, errorRedirect));

router.post("/", accessControl.hasRoleRoute(constants.ROLE_EDITOR, function(req, res) {
	// redirect to edit fish
	db.fish.newFish(req.body).then(function(fish) {
        if (fish) {
            res.redirect("/fish/edit/"+fish.id);
        }
    }).error(function(err) {
        res.status(500).send(err);
    });
}, errorRedirect));

router.get("/edit/:id", accessControl.hasRoleRoute(constants.ROLE_EDITOR, function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        var query = db.fish.getGenericQuery();
        query.where = {
            id: id
        };
        db.fish.find(query).then(function(fish) {
            var jsonPics = fish.fishpics.map(function(pic) {
                return pic.get();
            });
            res.render("fish/edit", {
                fish:{
                    id: fish.id,
                    scientificName: fish.getScientificName(), 
                    commonnames: fish.commonnames,
                    fishpics: jsonPics
                },
                action: "/fish/edit/"+id,
                currentUser: req.user
            });
        });
    } else {
        res.status(500).render("500");
    }
}, errorRedirect));

router.get("/commonname", function(req, res) {
    res.render("fish/commonname.ejs", {nameListBaseURL:"/fish/commonname/"});
});

router.get("/commonname/:letter", function(req, res) {
    var letter = req.params.letter;
    if (letter && letter.substr) {
        letter = letter.substr(0, 1);
        db.fish.findByFirstLetter(letter).then(function(results) {
            var fish = results.map(function (fish) {
                return fish.get();
            });
            var byName = [];
            fish.forEach(function(fish) {
                var names = fish.commonnames.split(",");
                names.forEach(function(name) {
                    if (name.indexOf(letter) === 0) {
                        byName.push({
                            name: name,
                            id: fish.id
                        });
                    }
                });
            });

            byName.sort(function(a,b) {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
            res.render("fish/commonnamelist", {fishes:byName, letter: letter});
        }).error(function(err) {
            res.status(500).render("500");
        });
    } else {
        res.status(500).render("500");
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
                var simpleFish = fish.get();
                simpleFish.binomialName = simpleFish.genus.name+" "+simpleFish.species;
                simpleFish.formattedCommonNames = simpleFish.commonnames.split(",").join(", ");
                res.render("fish/specificfish", {fishJSON:JSON.stringify(simpleFish), fishId:simpleFish.id});
            } else {
                res.status(500).render("500");
            }
        });
    } else {
        res.status(500).render("500");
    }
});

module.exports = router;
var express = require("express");
var router = express.Router();
var constants = require("../constants");
var db = require("../models/");
var accessControl = require("../accessControl");

// Editors only!
router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, function(req, res) {
    res.redirect("/");
}));

router.get("/add", function(req, res) {
	res.render("fish/add", {fish:{}});
});

router.post("/", function(req, res) {
	// redirect to edit fish
	db.fish.newFish(req.body, function(fish, err) {
        if (fish) {
            res.redirect("/fish/edit/"+fish.id);
        } else {
            res.status(500).send(err);
        }
    });
});

router.get("/edit/:id", function(req, res) {
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
});

module.exports = router;
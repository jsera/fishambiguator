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
            res.send(err);
        }
    });
});

router.get("/edit/:id", function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        db.fish.find({
            where: {
                id: id
            },
            include: [db.genus]
        }).then(function(fish) {
            res.render("fish/edit", {
                fish:{
                    id: fish.id,
                    scientificName: fish.getScientificName(), 
                    commonnames: fish.commonnames
                },
                action: "/fish/edit/"+id
            });
        });
    } else {
        res.render("500");
    }
});

module.exports = router;
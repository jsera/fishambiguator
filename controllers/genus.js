var express = require("express");
var router = express.Router();
var db = require("../models/");

router.get("/letter", function(req, res) {
    res.render("genus/allletters", {nameListBaseURL:"/genus/letter/"});
});

router.get("/letter/:letter", function(req, res) {
    db.genus.findByFirstLetter(req.params.letter).then(function (genera) {
        if (genera) {
            var simpleGenus = genera.map(function(genus) {
                return genus.get();
            });
            res.render("genus/letter", {genera: simpleGenus, letter: req.params.letter});
        } else {
            res.status(500).render("500");
        }
    }).error(function(err) {
        res.status(500).render("500");
    });
});

router.get("/:id", function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        db.genus.findOne({
            where: {
                id: id
            },
            include: [db.fish]
        }).then(function(genus) {
            if (genus) {
                var simpleGenus = genus.get();
                res.render("genus/specificgenus", {genus: simpleGenus});
            } else {
                res.status(500).render("500");
            }
        });
    } else {
        res.status(500).render("500");
    }
});

module.exports = router;
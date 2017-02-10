// pair ID should be pretty transparent for the most part. You shouldn't have to create a pair, a pair should be gotten or created when you create a comment
// getting a fishpair should be by two fish IDs.
var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, accessControl.sendNotLoggedIn).unless({
    method: "GET"
}));

router.get("/:fish1/:fish2", function(req, res) {
    console.log(req.params);
    var fish1 = req.params.fish1;
    var fish2 = req.params.fish2;
    if (!isNaN(fish1) && !isNaN(fish2)) {
        db.fishpair.findOne({
            where: {
                fish1: fish1,
                fish2: fish2
            }
        }).then(function(pair) {
            res.send(pair);
        });
    } else {
        res.send({
            error: "One or both of those IDs aren't numbers!"
        });
    }
});

module.exports = router;
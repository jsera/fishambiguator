// comments only make sense in the context of a pairing
// When we receive a new comment, try to get the pair, if the pair doesn't exist,
// create a pair, then get it.
// Then create the comment and attach it to the pairing.

// We want author name, date, and comment body.

// on comment update, we need to check if the curent user owns this comment, unless the user is a superuser.
var express = require("express");
var router = express.Router();
var db = require("../models/");
var accessControl = require("../accessControl");
var constants = require("../constants");

router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, accessControl.sendNotLoggedIn).unless({
    method: "GET"
}));

router.get("/:id", function(req, res) {
    var id = req.params.id;
    if (!isNaN(id)) {
        db.fishpair_comment.findOne({
            where:{
                id:id
            }
        }).then(function(comment) {
            if (comment) {
                res.send(comment.get());
            } else {
                res.send({
                    error: "Invalid comment ID"
                });
            }
        });
    } else {
        res.send({
            error: "That's not a proper ID"
        });
    }
});

router.post("/", function(req, res) {
    
});

module.exports = router;

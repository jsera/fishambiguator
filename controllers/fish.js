var express = require("express");
var router = express.Router();
var constants = require("../constants");

// Editors only!
router.use(function(req, res, next) {
    if (req.user) {
        if (req.user.hasRoleName(constants.ROLE_EDITOR)) {
            next();
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

module.exports = router;
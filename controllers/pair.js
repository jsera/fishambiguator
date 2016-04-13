var express = require("express");
var router = express.Router();
var constants = require("../constants");
var db = require("../models/");
var accessControl = require("../accessControl");

router.use(accessControl.hasRoleExclusive(constants.ROLE_EDITOR, function(req, res) {
    res.redirect("/");
}));

router.get("/add", function(req, res) {
    res.render("pair/add.ejs");
});

module.exports = router;
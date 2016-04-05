var express = require("express");
var router = express.Router();

router.post("/", function(req, res) {
    if (req.query.scientificname || req.query.commonname) {

    } else {
        res.send({error:"Must specify a query! We have a lot of fish."});
    }
});

module.exports = router;
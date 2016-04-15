var db = require("../models/");
var assert = require("assert");

describe("Tests for fishpair comments", function() {
    var testFish1 = null;
    var testFish2 = null;
    var testPair = null;
    var testComment = null;

    before(function(done) {
        db.fish.newFish({
            commonnames: "foo fish",
            scientificName: "fooius fishius"
        }).then(function(fish) {
            testFish1 = fish;

            db.fish.newFish({
                commonnames: "bar fish",
                scientificName: "fooius barrius"
            }).then(function(fish) {
                testFish2 = fish;

                db.fishpair.create({
                    fish1: testFish1.id,
                    fish2: testFish2.id
                }).then(function(pair) {
                    testPair = pair;
                    done();
                });
            });
        });
    });

    it("Is going to create a comment", function(done) {
        db.fishpair_comment.create({
            fishpairId: testPair.id,
            userId: 1,
            text: "foo"
        }).then(function(comment) {
            testComment = comment;
            done();
        });
    });

    it("Is going to test comment deletion", function(done) {
        testComment.destroy().then(function() {
            done();
        });
    });

    after(function(done) {
        db.genus.findById(testFish1.genusId).then(function(genus) {
            genus.destroy().then(function() {
                testFish1.destroy().then(function() {
                    testFish2.destroy().then(function() {
                        testPair.destroy().then(function() {
                            done();
                        });
                    });
                });
            });
        });
    });
});
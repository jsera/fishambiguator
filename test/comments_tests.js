var db = require("../models/");
var assert = require("assert");

describe("Tests for fishpair comments", function() {
    var testFish1 = null;
    var testFish2 = null;
    var testPair = null;
    var testComment = null;
    var testComment2 = null;

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

    it("Is going to use newComment to create a comment", function(done) {
        db.fishpair_comment.newComment({
            fish1: testFish1.id,
            fish2: testFish2.id,
            text: "Barf!"
        }).then(function(comment) {
            testComment2 = comment;
            assert(comment.text === "Barf!", "Comment text should be Barf!");
            assert(comment.fishpairId === testPair.id, "Comment should be for the already created test pair.");
            done();
        }).error(function(err) {
            assert(false, err);
        });
    });

    it("Is going to test comment deletion", function(done) {
        testComment.destroy().then(function() {
            testComment2.destroy().then(function() {
                done();
            });
        });
    });
    // You always have to destroy the pair first because of foreign key constraints
    after(function(done) {
        db.genus.findById(testFish1.genusId).then(function(genus) {
            genus.destroy().then(function() {
                testPair.destroy().then(function() {
                    testFish2.destroy().then(function() {
                        testFish1.destroy().then(function() {
                            done();
                        });
                    });
                });
            });
        });
    });
});
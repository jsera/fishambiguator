var should = require("chai").should();
var expect = require("chai").expect;
var request = require("supertest");
var db = require("../models/");
var assert = require("assert");

describe("Fish pair tests", function() {
    var testPair = null;
    var testFish1 = null;
    var testFish2 = null;
    var testFish3 = null;
    var testFish4 = null;
    var testPair2 = null;

    before(function(done) {
        var doneCount = 4;
        var isDone = function() {
            if (--doneCount == 0) {
                done();
            }
        };
        // make sure they both have the same genus
        db.fish.newFish({
            commonnames: "foo fish",
            scientificName: "fooius fishius"
        }).then(function(fish) {
            testFish1 = fish;
            isDone();
        });

        db.fish.newFish({
            commonnames: "bar fish",
            scientificName: "fooius barrius"
        }).then(function(fish) {
            testFish2 = fish;
            isDone();
        });

        db.fish.newFish({
            commonnames: "baz fish",
            scientificName: "fooius bazzius"
        }).then(function(fish) {
            testFish3 = fish;
            isDone();
        });

        db.fish.newFish({
            commonnames: "banded quux",
            scientificName: "fooius quuxius"
        }).then(function(fish) {
            testFish4 = fish;
            isDone();
        });
    });

    it("Should be able to create a new fish pair", function(done) {
        db.fishpair.findOrCreate({
            where: {
                fish1: testFish1.id,
                fish2: testFish2.id
            }
        }).spread(function(pair, created) {
            testPair = pair;
            assert(created, "Pair should have been created");
            done();
        });
    });

    it("Should not create a new pair if the IDs are swapped", function(done) {
        db.fishpair.findOrCreate({
            where: {
                fish1: testFish2.id,
                fish2: testFish1.id
            }
        }).spread(function(pair, created) {
            if (created) {
                pair.destroy().then(function() {
                    assert(false, "Fish pair should not be created");
                    done();
                });
            } else {
                testPair = pair;
                assert(true, "Fish pair was not created.");
                done();
            }
        });
    });

    it("Is going to print some JSON boyeeee", function(done) {
        db.fish.find({
            where: {
                id: testFish2.id
            }
        }).then(function(fish) {
            console.log("****** Got me a fishie!", fish.get());
            done();
        });
    });

    it("Is going to use the newPair function", function(done) {
        db.fishpair.newPair(
            testFish3.id, 
            testFish4.id
        ).then(function(pair) {
            testPair2 = pair;
            console.log("Used newPair! ", pair.get());
            done();
        });
    });

    it("Should give me an error on a nonexistent pair", function(done) {
        var badID1 = null;
        var badID2 = null;
        db.fish.newFish({
            commonnames: "Gonna dieeee",
            scientificName: "fooius dieeeee"
        }).then(function(fish) {
            badId1 = fish.id;
            fish.destroy().then(function() {
                db.fish.newFish({
                    commonnames: "kill me",
                    scientificName: "fooius killme"
                }).then(function(fish) {
                    badID2 = fish.id;
                    fish.destroy().then(function() {
                        db.fishpair.newPair(
                            badID1,
                            badID2
                        ).then(function(pair) {
                            console.log("Got a pair? ",pair.get());
                            expect(pair).to.be.null;
                            done();
                        }).error(function() {
                            assert(true, "Used promiseLib to throw an error!");
                            done();
                        });
                    });
                });
            });
        });
    });

    after(function(done) {
        db.genus.findById(testFish1.genusId).then(function(genus) {
            testPair.destroy().then(function() {
                genus.destroy().then(function() {
                    testFish1.destroy().then(function() {
                        testFish2.destroy().then(function() {
                            testPair2.destroy().then(function() {
                                testFish4.destroy().then(function() {
                                    testFish3.destroy().then(function() {
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
var should = require("chai").should();
var expect = require("chai").expect;
var request = require("supertest");
var db = require("../models/");

describe("Fish scientific name tests", function() {
	var testFish = null;
	var testGenus = null;
	var testGenusName = "Fishy";
	var testSpeciesName = "Fishy"

	before(function(done) {
		db.fish.create({}).then(function(fish) {
			testFish = fish;
			db.genus.create({name:testGenusName}).then(function(genus) {
				testGenus = genus;
				done();
			});
		});
	});

	it("Should be able to add a fish to a genus", function(done) {
		testGenus.addFish(testFish).then(function() {
			done();
		});
	});

	it("Should be able to remove a fish from a genus", function(done) {
		testGenus.removeFish(testFish).then(function() {
			done();
		});
	});

	it("Should set and get scientific names", function(done) {
		var scientificName = "Fishy Fishy";
		testFish.setScientificName(scientificName, function(fish) {
			testFish.getScientificName(function(name) {
				expect(name).to.equal(scientificName);
				done();
			});
		});
	});

	after(function(done) {
		if (testFish) {
			var destroyFish = function() {
				testFish.destroy().then(function() {
					done();
				});
			};
			if (testGenus) {
				testGenus.destroy().then(destroyFish);
			} else {
				destroyFish();
			}
		}
	});
});
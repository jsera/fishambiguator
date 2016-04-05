var should = require("chai").should();
var expect = require("chai").expect;
var request = require("supertest");
var db = require("../models/");

describe("Fish name tests", function() {
	var testFish = null;
	var testGenus = null;
	var testGenusName = "Fishy";
	var testSpeciesName = "Fishy"
	var testScientificName = testGenusName+" "+testSpeciesName;
	var testCommonNames = ["Spiny Lumpsucker", "Tiny cute fish"];

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
		testFish.setScientificName(testScientificName, function(fish) {
			testFish.getScientificName(function(name) {
				expect(name).to.equal(testScientificName);
				done();
			});
		});
	});

	it("Should get scientific name synchronously when genus is eagerly loaded", function(done) {
		db.fish.find({
			where: {
				id: testFish.id
			},
			include: [db.genus]
		}).then(function(fish) {
			expect(fish.getScientificName()).to.equal(testScientificName);
			done();
		});
	});

	it("Should be able to set common names as a comma-delimited string", function(done) {
		testFish.commonnames = testCommonNames.join(",");
		testFish.save().then(function() {
			done();
		});
	});

	it("Should be able to read common names as a comma-delimited string", function(done) {
		db.fish.find({
			where: {
				id: testFish.id
			}
		}).then(function(fish) {
			expect(fish.commonnames).to.equal(testCommonNames.join(","));
			done();
		});
	});

	it("Should trim common names", function(done) {
		var goofyNames = ["   \n\nSpiny Lumpsucker", "A Fish\n\n\n   \t  \n\n", "\t\t\t\t\t\t\n\n    something else\n  \n  \t"];
		var nonGoofyNames = goofyNames.map(function(name) {
			return name.trim();
		});
		testFish.commonnames = goofyNames.join(",");
		testFish.save().then(function() {
			db.fish.find({
				where: {
					id: testFish.id
				}
			}).then(function(fish) {
				expect(fish.commonnames).to.equal(nonGoofyNames.join(","));
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
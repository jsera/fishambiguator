var should = require("chai").should();
var expect = require("chai").expect;
var request = require("supertest");
var assert = require("assert");
var helpers = require("../helpers/");

describe("Image helper tests", function() {
	var res = {
		locals: {}
	};

	before(function(done) {
		var middleware = helpers({
			staticImagePath: "http://foo.com"
		});
		middleware({}, res, done);
	});

	it("Should append staticImagePath to the front of a string", function(done) {
		var result = res.locals.helpers.staticImagePath("/lol.jpg");
		assert(result === "http://foo.com/lol.jpg");
		done();
	});

	it("Should append a leading slash if you don't give it one.", function(done) {
		var result = res.locals.helpers.staticImagePath("lol.jpg");
		assert(result === "http://foo.com/lol.jpg");
		done();
	});
});
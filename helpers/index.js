var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var helpers = [];
var helperScope = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.slice(-3) == '.js') && (file !== basename);
  })
  .forEach(function(file) {
    var helper = require(path.join(__dirname, file));
    helpers.push({
    	name: file.substr(0, file.length-3),
    	helper: helper
    });
  });

module.exports = function(config) {
	if (config && typeof(config) == "object") {
		helperScope = config;
	}
	return function(req, res, next) {
		var finalHelpers = {}
		helpers.forEach(function(container) {
			finalHelpers[container.name] = function() {
				return container.helper.apply(
					helperScope, 
					Array.prototype.slice.apply(arguments)
				);
			}
		});
		res.locals.helpers = finalHelpers;
		next();
	}
};
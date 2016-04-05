var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var helpers = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.slice(-3) == '.js') && (file !== basename);
  })
  .forEach(function(file) {
    var helper = require(path.join(__dirname, file));
    helpers[file.substr(0, file.length-3)] = helper;
  });

module.exports = function() {
	return function(req, res, next) {
		res.locals.helpers = helpers;
		next();
	}
};
module.exports = function(image) {
	if (process.env.STATIC_SERVER) {
		if (image.substr(0, 1) !== "/") {
			image = "/" + image;
		}
		return process.env.STATIC_SERVER + image;
	} else {
		return image;
	}
};
module.exports = function(image) {
	if (this.staticImagePath) {
		if (image.substr(0, 1) !== "/") {
			image = "/" + image;
		}
		return this.staticImagePath + image;
	} else {
		return image;
	}
};
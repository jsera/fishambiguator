function test() {
	aArgs = Array.prototype.slice.apply(arguments);
	aArgs.forEach(function(item) {
		console.log(item);
	});
}

test("foo", "bar", "baz");
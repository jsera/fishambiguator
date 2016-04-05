function returnClosure() {
	var source = "function";

	return function() {
		console.log("I am from "+source);
	}
}

var otherScope = {
	source: "object"
};

returnClosure().apply(otherScope);
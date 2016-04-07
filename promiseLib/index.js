module.exports = {
	getPromiseHolder: function() {
		return {
			callbackF: null,
			errorF: null,
			callback: function() {
				if (this.callbackF) {
					return this.callbackF.apply(null, Array.prototype.slice.apply(arguments));
				}
			},
			error: function() {
				var args = Array.prototype.slice.apply(arguments);
				var scope = this;
				if (this.errorF) {
					return this.errorF.apply(this, args);
				} else {
					// sometimes the error will be called synchronously
					setTimeout(function() {
						if (scope.errorF) {
							scope.errorF.apply(scope, args);
						}
					}, 0);
				}
			}
		};
	},
	getPromise: function(holder) {
		return {
			then: function(callback) {
				holder.callbackF = callback;
				return this;
			},
			error: function(callback) {
				holder.errorF = callback;
				return this;
			}
		};
	}
};
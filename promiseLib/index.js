module.exports = {
	getPromiseHolder: function() {
		return {
			callbackF: null,
			errorF: null,
			callback: function() {
				if (this.callbackF) {
					this.callbackF().call(this, Array.prototype.slice.apply(arguments));
				}
			},
			error: function() {
				if (this.errorF) {
					this.errorF.call(this, Array.prototype.slice.apply(arguments));
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
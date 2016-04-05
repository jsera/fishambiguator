module.exports = {
	getPromiseHolder: function() {
		return {
			callback: null,
			error: null
		};
	},
	getPromise: function(holder) {
		return {
			then: function(callback) {
				holder.callback = callback;
				return this;
			},
			error: function(callback) {
				holder.error = callback;
				return this;
			}
		};
	}
};
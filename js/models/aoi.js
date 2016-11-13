var AOI = Backbone.Model.extend({

	defaults: {
		type: null,
		string: null
	},
	initialize: function() {
		// this.typedisplay=this.displayName
		this.set({
			message: this.message()
		})
		this.bind("change:type", this.message, this);
	},
	message: function() {
		switch (this.get("type")) {
			case "pair":
				this.set({
					message: "We think you entered a coordinate pair. Should we process this (using WGS84) as your area of interest?"
				});
				break;
			case "poly":
				this.set({
					message: "We think you entered a coordinate polygon string. Should we process this (using WGS84) as your area of interest?"
				});
				break;
			case "wkt":
				this.set({
					message: "We think you entered a WKT string. Should we process this (using WGS84) as your area of interest?"
				});
				break;
			default:
				this.set({
					message: "We couldn't detect the format of what you typed. In fact, you shouldn't even be seeing this."
				});
		}
		return this
	}
});

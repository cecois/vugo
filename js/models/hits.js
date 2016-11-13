var Hits = Backbone.Collection.extend({
	model: Hit,
	url: function() {
		return "../../solr/select/?version=2.2&start=0&rows=25&indent=on&wt=json&q=" + this.query
	},
	initialize: function(options) {
		options || (options = {});
		this.query = options.query;
	},
	setQuery: function(query) {
		this.query = query;
	}
});
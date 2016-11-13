var DiscCollection = Backbone.Collection.extend({
	model: Disc,
	url:function(){
		return "../api/v1/discs/"+this.series+"/json/individual"
	},

	initialize: function(options) {
		options || (options = {});
	}

});
var Updates = Backbone.Model.extend({

	defaults:{

		range:"2012-09-01:2013-02-28"

	},

	url: function(){

		return "../api/v1/updates/"+this.get("series")+"/"+this.get("range")+"/json";
	},
	initialize:function(){


	}

});


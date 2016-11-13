var DownloadObject = Backbone.Model.extend({
	defaults: {
	},
	url:function(){
		var gfsid = this.get("0")
		return "../api/v1/download/"+apikey+"/"+sessionkooky+"/"+gfsid;
	},
	initialize: function(options) {
		options || (options = {});
        this.url = this.url();   
	}
});
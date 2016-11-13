var Downloads = Backbone.Collection.extend({
	model: Download,
	options:{},
	url:function(){
		return "../api/v1/downloads/"+this.apikey+"/"+this.sessionid
	},

	initialize: function(options) {
            options || (options = {});
            this.apikey = options.apikey;
            this.sessionid = options.sessionid;
          },

	parse: function(data) {

/*
btw we used to fuss with the mongo key here (fakeid), but now it's happening in php b4 it gets here
*/
		datax = _.sortBy(data,"queued").reverse();

		return datax;
	}


});
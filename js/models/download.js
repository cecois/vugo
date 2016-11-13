var Download = Backbone.Model.extend({
	defaults: {
				envelopeUrl: '',
		envelonoff: false
	},
	idAttribute: "_fakeid",
	rights: function() {
	},
	url:function(){
		return "../api/v1/downloads/"+this.apikey+"/"+this.sessionid+"/"+this.get("_fakeid");
	},
	initialize: function(options) {
		options || (options = {});
            this.apikey = options.apikey;
            this.sessionid = options.sessionid;
        this.url = this.url()
        // this.count = this.count() 
        var ofl = _.toArray(this.get("outfiles")).length;
        this.set({dlcnt:ofl});
		var series = this.get("series");
		var handle = this.get("handle");
		var format = this.get("format");

		switch(format){

		case "raster":
			if(series=="cdrg"){
				// cdrg is messy bc it's a big "series" comprised of a bunch of actually specific, thematic series
						this.set({
							"envelopeUrl": "../api/v1/rasterenvelopes/" + handle + "/all/geojson/aggregate"
						});} else {
						
									this.set({
										"envelopeUrl": "../api/v1/rasterenvelopes/" + handle + "/all/geojson/aggregate"
									});}

			this.set({
				"coverageUrl": "../api/v1/rasterenvelopes/" + series + "/all/geojson/individual"
			});

			break
		case "vector":
			this.set({
				"envelopeUrl": "../api/v1/vectorenvelopes/" + series + "/" + handle + "/geojson"
			});

			break;
		
		} //switch
	},
	/*
BIG OVERRIDE OF SAVE -- A #returnto BC NEWER SLIM PHP SUPPORTS PATCH AND THIS IS AN END-AROUND

model.save(null, {attrs:attributesToSave});

	*/
	save: function (attrs, fieldhash, options) { 
			// sock this away bc we'll want it back after this crazy override
			var prurl = this.url;
			if(fieldhash){
			var murl = this.url+"/"+fieldhash;
			this.url = murl;
			} else{
			this.url = this.url+"/all";
			}

			    // Call super with attrs moved to options
			    Backbone.Model.prototype.save.call(this, attrs, options);

			this.url=prurl;
    return this
}

	
});
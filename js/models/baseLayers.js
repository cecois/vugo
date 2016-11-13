var BaseLayersCollection = Backbone.Collection.extend({
	model: BaseLayer,
	url:function(){
		return "js/models/layers.min.json"
	},
	initialize: function(options) {
            options || (options = {});
            // this.query = options.query;
          }
          ,

	parse: function(data) {
		var layers = data.layers;

	// 	var activeLayer = _.find(layers, function(lay){ return lay.active == true; });
	// 	var activeLayerDef = activeLayer.definition;

	// 	console.log("in parse of BaseLayersCollection, activeLayerDef=");
	// console.log(activeLayerDef)



	// appBaseMapView.listenTo(appBaseMap,'change',appBaseMapView.updateBaseMap());
// }

	/* ----------
...Hey, did you see that? We're manualling calling the updateBaseMap method on the view because having it in init was causing *all* basemaps to be very quickly set and removed. Which isn't a huge deal until you consider that with each one all of those tiles were being requested and therefore clogging up the works.
------------ */

	return layers;
	} //custom parse

});
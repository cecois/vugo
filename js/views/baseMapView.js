var BaseMapView = Backbone.View.extend({

	id: "map",
	initialize: function() {
	},
	render: function() {
  var am = this.collection.findWhere({active:true});

this.updateBaseMap(am);
	// var mapBounds = am.getBounds();
	// map.fitBounds(mapBounds);

	return this
	// .updateBaseMap()
	// .zoomCheck()


	},
	updateBaseMap: function(am){
		var activeModel = am
		var def = activeModel.get("definition");

		// remove global layer here first so we don't keep stacking baselayers
 // (we only need one baselayer at a time, of course)
 if(typeof baseLayer == 'undefined'){
 		baseLayer = null;
 	} else {
 			map.removeLayer(baseLayer);
 		}
 			appConsole.set({message:"Basemap switched to "+activeModel.get("nom")})
 		// a little special handling for stamen maps
 		if (activeModel.get("source") == "stamen"){

 			baseLayer = new L.StamenTileLayer(def.id);

 			appConsole.set({message:"Basemap switched to "+activeModel.get("nom")+", which might have zoom restrictions"})

 		}

		else if (def.subdomains != undefined) {

			baseLayer = new L.TileLayer(def.url, {
				subdomains: def.subdomains,
				maxZoom: 18
			});

		} else {

			baseLayer = new L.TileLayer(def.url, {
				maxZoom: 18
			});
		}
		map.addLayer(baseLayer);
		baseLayer.bringToBack();


	return this
	// .zoomCheck()


	}



});
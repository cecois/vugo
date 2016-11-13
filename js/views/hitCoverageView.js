var HitCoverageView = Backbone.View.extend({
	id: "map",
	events: {},
	options:{},
	initialize: function() {
		this.model.bind('change:covonoff', this.render, this);
		// this.render();
	},
	retrieveHitCoverageJson: function(url, activityMsg) {
		var json = (function() {
			var json = null;
			$.ajax({
				'async': false,
				'global': false,
				'url': url,
				'dataType': "json",
				'success': function(data) {
					json = data;
				}
			});
			return json;
		})();
		return json;
	},
	makeLeafletRender: function(layer) {
		var g = L.tileLayer.wms(geowebCacheRoot, {
			layers: layer,
			format: 'image/png',
			transparent: true
		});
		return g;
	},
	render: function() {
		var series = this.model.get("series");
		if (this.model.get("covonoff") == true) {

// 			if(series == "cdrg"){
// // layers=series+":"+handle
// 			var layer = "envelopes:envelopes-cdrg_" + this.model.get("handle")
// }
			var layer = "envelopes:envelopes-" + this.model.get("handle")
			// var layer = "envelopes:" + this.model.get("handle")
			var gwc = this.makeLeafletRender(layer);
			// some gui feedback
			gwc.on("load", function() {
				appActivityView.reset();
				appConsole.set({
					message: "What just happened? We loaded envelopes depicting every tile available."
				});
			});
			rasterEnvelopes.addLayer(gwc);

// we need to tie the envelopeid to the model so that other views can manipulate based thereupon
				this.model.set({coverageid:gwc._leaflet_id});			
			this.options.coverageid = gwc._leaflet_id;
			// this.zoom();
			/*var hitFeatures = this.retrieveHitCoverageJson(this.model.get("coverageUrl"));
			if (hitFeatures.features[0].geometry != undefined) {
				var j = addHitGeoJSONPoly(hitFeatures.features).addTo(hitCoverageJson);
				map.fitBounds(hitCoverageJson.getBounds());
				// but then sock away the leaflet id so we can remove it again later
				this.options.coverageid = j._leaflet_id;
				appConsole.set({message:"What's this? The extents of each tile in series '"+this.model.get("title")+"'"});} else {
				appConsole.set({
					message: "Hmph. Failure."
				});
			} //else geojson failure*/
		} else {
			// ok, so we're here because the covonoff evald to false, meaning we need to kill it
			// first we give em a throbber
			appActivity.set({
				spin: true,
				message: "removing coverage tiles"
			});
			/* ----------
this one killed for a while: without the manual unbind here, successive hitPreviewView creations would snowball, with all events stacking and repeating N times for how many times the thing was rendered.

#returnto though, because newer Backbone versions might handle this more gracefully
------------ */
			this.model.unbind('change:covonoff');
			// then grab that leaflet id
			var killid = this.options.coverageid

			// walk through the layers in the envelope group, shopping that id
			$.each(rasterEnvelopes._layers, function(index, layer) {
				if (layer._leaflet_id == killid) {
					// found it! kill it! kill it all to hell!
					rasterEnvelopes.removeLayer(layer);
				}
			});
			appActivityView.reset()
			appConsoleView.reset()
		}
	}
}); //view
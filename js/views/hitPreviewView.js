var HitPreviewView = Backbone.View.extend({
	id: "map",
	events: {},
	options:{},
	initialize: function() {
		this.model.bind('change:prevonoff', this.render, this);
	},
	render: function() {
		var filename = "hitPreviewView.js";
		if (this.model.get("prevonoff") == true) {

			var format = this.model.get("format");
			switch (format) {
			case "raster":
				appActivity.set({
					spin: true,
					message: "fetching preview tiles"
				});
				var series = this.model.get("series");
				var handle = this.model.get("handle");
				var gwc = this.model.makeLeafletWMS(series,handle);
				hitPreviews.addLayer(gwc);
				// #returnto don't both of the following
				this.options.previewid = gwc._leaflet_id;
				this.model.set({previewid:gwc._leaflet_id});
				appConsole.set({
					message: "What's this? A rendering of actual data from series '" + this.model.get("title") + "'"
				});
				this.zoom();
				break
			case "vector":

				var series = this.model.get("series");
				var handle = this.model.get("handle");

				appActivity.set({
					spin: true,
					message: "checking for features within current map extent"
				});


/*
At this point we wanna first see if there are any features we can load directly into the current map extent (so users won't be zoomed around the map inexplicably).
*/

// first we get current map extent
var bbox = map.getBounds().toBBoxString();

// we construct a geoserver url using that bbox as a filter
// note the maxfeatures is 1, meaning "is there even just one feature within this extent?"
var gsurl = "http://"+apphost+"/gs/"+series+"/ows?service=WFS&version=1.1&request=GetFeature&typeName="+series+":"+handle+"&maxFeatures=1&outputFormat=application/json&bbox="+bbox;

// fire off this url, the response is JSON of actual features
var features = getFeaturesWithinExtent(gsurl);

// and we really only want the count
var withincount = features.features.length;

// so if there was at least one...
if(withincount > 0){
				appActivity.set({
					spin: true,
					message: "found at least 1, fetching a sample of "+vectorLimit+"..."
				});



// when cib01 is ready we'll have a few #returnto #cib01 hacks to clean up
				if (series == "envelopes" && handle == "cib01_staging" ){
					// that is, if this is an index to raster data, we probably just wanna render it like we do rasters anyway
				var gwc = this.model.makeLeafletWMS(series,handle);
				hitPreviews.addLayer(gwc);
				this.options.previewid = gwc._leaflet_id;
				this.model.set({previewid:gwc._leaflet_id});
				this.zoom();
				} else {
/*
it's not an index, so we'll pull back GeoJSON from geoserver, passing the bbox that we NOW KNOW will contain at least one feature
*/
								var leafjson = this.model.makeLeafletGeoJSON(bbox);
								hitPreviews.addLayer(leafjson);
								this.options.previewid = leafjson._leaflet_id;
									this.model.set({previewid:leafjson._leaflet_id});
								var lb = leafjson.getBounds();
								map.fitBounds(lb);
							}
						} else {

appActivity.set({
					spin: true,
					message: "no features found within the map extent, we'll zoom to a sample"
				});

// ok, the current bbox isn't gonna work, so we'll shut up about it
								var leafjson = this.model.makeLeafletGeoJSON();
								hitPreviews.addLayer(leafjson);
								this.options.previewid = leafjson._leaflet_id;
								var lb = leafjson.getBounds();
								map.fitBounds(lb);

						}//withincount check
				appActivityView.reset()

				appConsole.set({
					message: "You are previewing data from series '" + this.model.get("title") + ",' but note not all features may appear."
				});

				appConsoleView.render()
				break;
			}

		} else {

			// ok, so we're here because the covonoff evald to false, meaning we need to kill it
			// first we give em a throbber
			appActivity.set({
				spin: true,
				message: "removing preview"
			});
			// then grab that leaflet id
			/* ----------
this one killed for a while: without the manual unbind here, successive hitPreviewView creations would snowball, with all events stacking and repeating N times for how many times the thing was rendered.

#returnto though, because newer Backbone versions might handle this more gracefully
------------ */
			this.model.unbind('change:prevonoff');
			var killid = this.options.previewid

			// walk through the layers in the envelope group, shopping that id
			$.each(hitPreviews._layers, function(index, layer) {
				if (layer._leaflet_id == killid) {
					// found it! kill it! kill it all to hell!
					hitPreviews.removeLayer(layer);
				}
			});
			appConsoleView.reset()
			appActivityView.reset();
		}
		return this
	},
	zoom: function() {
		/*
what is this? well, we want to zoom on the previewed raster layer. While there were a few ways to do this,
we're already hitting the api for an extent we know is there (envelope render thing), so why not just do the same here:
grab the envelope, throw it in a fake geojson layer (that we never actually add to the map) so we can move the map there
*/

		var hitFeatures = retrieveHitJson(this.model.get("envelopeUrl"));
		var deadGeojson = L.geoJson(hitFeatures.features[0].geometry, {});
		if (hitFeatures.features[0].geometry.coordinates != undefined) {
			// map.fitBounds(deadGeojson.getBounds());
		} else {
			appConsole.set({
				message: "Couldn't zoom to it, but it might still have appeared on the map."
			});
		}
	}
}); //view
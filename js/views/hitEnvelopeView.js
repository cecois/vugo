var HitEnvelopeView = Backbone.View.extend({
	id: "map",
	events: {},
	options:{},
	initialize: function() {
		this.model.bind('change:envelonoff', this.render, this);
		// this.render();
	},
	render: function() {
		// firs of all, the model has to have an envelonoff state of true
		if (this.model.get("envelonoff") == true) {
			// if so, we get some json from the model's envelopeurl
			var hitFeatures = retrieveHitJson(this.model.get("envelopeUrl"));
			if (hitFeatures.features[0].geometry != undefined) {
				// assuming it worked...
				// we make some geojson out of it
				var j = addHitGeoJSONPoly(hitFeatures.features[0].geometry,this.model.get("handle"))
				// add it to the catch-all envelope group
				j.addTo(hitEnvelopeJson);
				// var z = map.getBoundsZoom(j.getBounds());
				map.fitBounds(j.getBounds())
				// but then sock away the leaflet id so we can remove it again later
				this.options.envelopeid = j._leaflet_id;

// we need to tie the envelopeid to the model so that other views can manipulate based thereupon
				this.model.set({envelopeid:j._leaflet_id});
				// zoom to it!
				// map.fitBounds(hitEnvelopeJson.getBounds());
				appConsole.set({
					message: "What's this? The spatial extent of the entire series '" + this.model.get("title") + "'"
				});
			} else {
				appConsole.set({
					message: "Hmph. Failure."
				});
			} //else
		} else {
			// ok, so we're here because the envelonoff evald to false, meaning we need to kill it
			// first grab that leaflet id
			var killid = this.options.envelopeid
			// walk through the layers in the envelope group, shopping that id
			$.each(hitEnvelopeJson._layers, function(index, layer) {
				if (layer._leaflet_id == killid) {
					// found it! kill it! kill it all to hell!
					hitEnvelopeJson.removeLayer(layer);
				}
			});
			appConsoleView.reset()
		}
	}
}); //view


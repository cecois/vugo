var UpdatesView = Backbone.View.extend({
	tagName: "div",
	// className: "updatesView",
	events: {},
	template: Handlebars.templates['updatesViewTpl'],
	initialize: function() {
		Handlebars.registerHelper('range_split', function(object) {
			var hbstring = '';
			// var myr = _.max(object,function(ob){return ob.date});
			if (object == "0") {
				hbstring = "range not applicable"
			} else {
				var rangearr = splitRange(object)
				var tmin = new Time(rangearr[0]).days(1)
				var tmax = new Time(rangearr[1]).days(1)
				hbstring = tmin.format("Y M d") + " to " + tmax.format("Y M d");
			}
			return hbstring;
		});
		this.model.on("change", this.render, this)
	},
	render: function() {
		masterClearLayers();
		$(this.el).html(this.template(this.model.toJSON()));
		return this.json2Leaflet()
	},
	rewire: function() {
		return this
		// .setRangeSlider(range)
	},
	fetchUpdates: function() {
		var range = this.model.get("range")
		if (range == '0') {
			var url = "../api/v1/updates/id:" + this.model.get("mongoid") + "/0/json"
		} else {
			var url = "../api/v1/updates/" + this.model.get("series") + "/" + this.model.get("range") + "/json";
		}
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
	//end fetchUpdates
	json2Leaflet: function() {
		var json = this.fetchUpdates();
		_.each(json, function(ftr) {
			if (typeof ftr.envelope !== 'undefined') {
				// nab the timestamp and convert to seconds
				var t = new Time(ftr.date_added.sec * 1000);
				// construct a popup
				var pustring = ftr.resid + " (dated " + ftr.date + ") added on " + t.format('Y-m-d');
				// generate the primitive from the mongo-stored WKT

				try {
					var geoPrimitive = Terraformer.WKT.parse(ftr.envelope);
					// Create a geojson thing with our new primitive object, pushing the label and popup
					var j = this.featureMake(geoPrimitive, ftr.resid, pustring)
					// add it to the catch-all envelope group
					j.addTo(updatesJson);
					map.fitBounds(updatesJson.getBounds());
				} catch (err) {
					console.log(err.message)
				}
			}
		}, this);
		return this
	},
	featureMake: function(geofrag, label, pu) {
		// well, ok - sometimes this random style thing doesn't work (doesn't return in time? not sure)
		// no big deal, tho, we'll just set a default here and only overwrite it if success
		var defStyle = {
			"color": "black",
			"fillColor": "white",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": .55
		}
		layStyle = randomStyle()
		if (typeof layStyle == 'undefined') {
			layStyle = defStyle
		}
		var colabl = layStyle.color;
		var geojson = L.geoJson(geofrag, {
			style: layStyle,
			onEachFeature: function(feature, layer) {
				layer.bindLabel(label, {
					noHide: true
				}), layer.bindPopup(pu, {
					noHide: true
				})
			}
		});
		return geojson;
	}
});
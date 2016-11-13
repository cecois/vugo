var ZoomLayerView = Backbone.View.extend({
	id: "map",
	options: {},
	events: {
		"change:source": "renderController"
	},
	initialize: function() {
		// this.bind(this.model, "change", this.renderController);
		this.model.bind("change", this.renderController, this);
		// this.model.bind("change", this.notify,this);
	},
	notify: function() {

	},
	renderController: function() {

		this.clean();
		var so = this.model.get("source");
		var qt = this.model.get("queryterm");

		switch (so) {
			case "nominatum":

				var rcresp = this.renderNominatum();
				// now see if Nominatum pulled through
				if (rcresp.coordinates != undefined) {
					// if (rcresp.coordinates == 999) { //just a way to fake failure
					addGeoJSONPoly(rcresp, rcresp.label);
					appActivityView.reset();
					appConsole.set({
						"message": "geocoding/data courtesy of OSM &amp; <a href='http://wiki.openstreetmap.org/wiki/Nominatim'>MapQuest/Nominatum</a>"
					});
				} //poly.geojson defined?
				else {
					var q = '../../geonames/collection1/select?q=name:"' + qt + '"*&wt=json&sort=score%20desc,population%20desc&rows=1';
					this.model.set({
						url: q,
						source: "geonames"
					});
				}


				break;
			case "geonames":
				var q = '../../geonames/collection1/select?q=name:"' + qt + '"*&wt=json&indent=on&sort=score%20desc,population%20desc&rows=1';
				this.model.set({
					url: q,
					source: "geonames"
				});
				var gresp = this.renderGeoNames()
				json = gresp;
				var lat = json.response.docs[0].latitude;
				var long = json.response.docs[0].longitude;
				// make lat/long into geojson
				var geojsonFeature = {
					"type": "Feature",
					"properties": {},
					"geometry": {
						"type": "Point",
						"coordinates": [long, lat]
					}
				}
				addGeoJSONPoint(geojsonFeature);
				appActivityView.reset();
				appConsole.set({
					"message": "geocoding data courtesy of <a href='http://geonames.org'>GeoNames</a>"
				});

				break;
			default:
		}
		appActivityView.reset();
	},
	render: function() {

		if (this.model.get("source") == "nominatum") {
			this.renderNominatum()
		}
		if (this.model.get("source") == "geonames") {
			this.renderGeoNames()
		}
	},
	renderGeoNames: function() {
		var gnresp = $.ajax({
			'async': true,
			'global': false,
			'url': this.model.get("url"),
			beforeSend: function() {
				appActivity.set({
					spin: true,
					message: "geocoding with GeoNames..."
				});
			},
			'dataType': "json",
			'failure': function(response) {
				rresp = response;
			},
			'success': function(data, textStatus) {
				json = data;
				if (json.response.numFound == 0) {
					var msg = "Neither Nominatum nor GeoNames could return a geometry for that, sorry.";
					appActivity.set({
						spin: false,
						message: msg
					});
					resp = false
				}
				var lat = json.response.docs[0].latitude;
				var lng = json.response.docs[0].longitude;
				// make lat/long into geojson
				var geojsonFeature = {
					"type": "Feature",
					"properties": {},
					"geometry": {
						"type": "Point",
						"coordinates": [lng, lat]
					}
				}
				addGeoJSONPoint(geojsonFeature)
				appActivityView.reset();
				rresp = json
			}
		}); //ajax
		return gnresp
	},
	renderNominatum: function() {
		// init a resp obj jic
		var resp = false;
		var poly = $.ajax({
			'async': false,
			'contentType': 'application/json; charset=UTF-8',
			'global': false,
			'url': this.model.get("url"),
			'beforeSend': function() {
				appActivity.set({
					spin: true,
					message: "geocoding with Nominatum..."
				});
			},
			// 'dataType': "jsonp",
			error: function(xh, ts, er) {
				// console.log("er:" + er);
				// console.log("ts:" + ts);
				appConsole.set({
					"message": er
				})
				return false
			},
			success: function(data, statusText) {
				// console.log("in success of renderNom, data is :"); console.log(data);
				// console.log("in success of renderNom, data[0] is :"); console.log(data[0]);
				var b = $.browser;
				// console.log(b)
				if (b.version <= 17) {
					var obj = $.parseJSON(data);
					var gdata = obj[0].geojson;
					gdata.label = obj[0].display_name;
				} else {
					var gdata = data[0].geojson
					gdata.label = data[0].display_name;
					// console.log(gdata)
				}
				// if (typeof data[0] != 'undefined') {
				if (gdata.coordinates.length > 0) {
					// well we at least got *something* from nominatum
					// if(typeof data[0].geojson != 'undefined'){
					// if(gdata.geojson.length > 0){
					// oh, and it had geojson on board!
					resp = gdata;
					return resp
					// }
				} else {
					resp = false
					return resp
				}
				return resp;
			} //success
		}); //ajax

		return resp;
	},
	renderFreeBase: function() {

		//first clear out that last one
		this.clean();
		$.ajax({
			'async': false,
			'global': false,
			'url': this.model.get("url"),
			'dataType': "json",
			'success': function(data, textStatus) {
				response = data;
				if (response.features[0].geometry.geometries != undefined) {
					$.each(response.features[0].geometry.geometries, function() {
						if (this.type == "MultiPolygon" || this.type == "Polygon") {

							addGeoJSONPoly(this);
						}
					}); //each
				} else {
					$.each(response.features[0], function() {
						addGeoJSONPoint(this);
					});
				} //else
			} //ajax
		});
	},
	//render
	clean: function() {
		geojsonZoom.clearLayers();
	}
}, this); //view

function addGeoJSONPoly(geofrag, label) {
	var geojson = L.geoJson(geofrag, {
		// style for all vector layers (color, opacity, etc.), either function or object (optional)
		style: randomStyle(),
		onEachFeature: function(feature, layer) {
			// sometimes the layer doesnt bind the bindlabel function, not sure why
			if (typeof(layer.bindLabel) === 'function') {
				layer.bindLabel(label, {
					noHide: true
				})
			}
		}
	}).addTo(geojsonZoom);
	map.fitBounds(geojson.getBounds());
}

function addGeoJSONPoint(geofrag, label) {
	var geojsonMarkerOptions = {
		radius: 13,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.6
	};
	var geojson = L.geoJson(geofrag, {
		pointToLayer: function(feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		onEachFeature: function(feature, layer) {
			layer.bindLabel(label, {
				noHide: true
			})
		}
	}).addTo(geojsonZoom);
	//map.panTo(geojson.getBounds().getCenter());
	map.setView(geojson.getBounds().getCenter(), 5);
}
var DownloadExtent = Backbone.Model.extend({
	defaults: {
		"geom": null,
		// "type": null
	},
	initialize: function() {
		this.listenTo(triagePlace,"change","check")
		// this.listenTo(map,"moveend","check")
		return this
		// .check()
	},
	check: function(){

console.log("in DLEX check:")
console.log(this.get("dlex"))

if(groupAOI.getLayers().length==0){
	this.set({geom:turf.bboxPolygon(LLGOD.boundsArrFromBBOX(map.getBounds().toBBoxString()))})

}

return this

	}


}); //dlex

var Query = Backbone.Model.extend({
	defaults: {
		// qurl: "../../solr/select/?version=2.2&rows=25&defType=edismax&wt=json&q=",
		qroot: "http://libgeoqa:8080/solr/select/?version=2.2&indent=off&wt=json&q=",
		querystring: '',
		spatialSolr: '',
		hash: "",
		numrows: 25,
		recordOffset: 0,
		query: ''
	},


	initialize: function() {

		// on init we want to craft a query string right away (before binding changes)
		// ...so we can bootstrap a search from incoming hash without firing off a bunch of change events

		// 		map.fitBounds([
		//     [this.get("bbox_south"), this.get("bbox_west")],
		//     [this.get("bbox_north"), this.get("bbox_east")]
		// ]);

		// this.setSpatialString();
		// this.recordOffset();
		// this.setQuery();

		// this.listenTo(this,'change:querystring', function() {
		// 			this.setQuery();
		// 		});

		// this.on("change:querystring", function() {
		// 	this.setQuery();
		// });
		// this.on("change:querystring", this.setQuery,this);
		// this.on("change:page", this.setQuery,this);
		// this.on("change:page", this.recordOffset,this);

		this.listenTo(appState, 'change', function() {
			this.get_query();
		});

		// this.on("change:page", function() {
		// 	this.recordOffset();
		// 	this.setQuery();
		// });

		// this.on("change:bbox_west change:bbox_south change:bbox_east change:bbox_north",function(){

		// 	this.setSpatialString();
		// 	this.setQuery();
		// })

	},

	get_sorters: function() {
		// most basic - score only
		var sorterString = '&sort=score desc';

		return sorterString;

	},
	get_filter_query: function() {

		var bounds = LLGOD.boundsFromBBOX(appState.get("bbox"))

		var bbox_west = bounds.getWest()
		var bbox_south = bounds.getSouth()
		var bbox_east = bounds.getEast()
		var bbox_north = bounds.getNorth()

		// these are xy/area/difference params that feed the ranking algorithm
		var xdif = Math.abs((bbox_east - bbox_west))
		var xdifAboveWest = (xdif / 2) + bbox_west
		var ydif = Math.abs((bbox_north - bbox_south))
		var ydifAboveSouth = (ydif / 2) + bbox_south

		// adjusted from OpenGeoPortal's solr fq, mostly just the minimum frange valu
		var fq = "-suppressed:true+AND+-suppressed:1&fq={!frange l=0 u=10}product(2.0,map(sum(map(sub(abs(sub(" + xdifAboveWest + "," + xdif + ")),sum(" + xdif / 2 + ",div(sub(bbox_east,bbox_west),2))),0,400000,1,0),map(sub(abs(sub(" + ydifAboveSouth + "," + ydif + ")),sum(" + ydif / 2 + ",div(sub(bbox_north,bbox_south),2))),0,400000,1,0)),0,0,1,0))";


		return fq;

	},
	get_query: function() {

		var querystring = appState.get("query");

		if (querystring.indexOf("_id:") > -1) { //someones already got what they want
			return querystring
		}


		var query = '{!lucene q.op=AND df=text}' + querystring + '~' + this.get_spatial() + this.get_filter_query() + "&start=" + this.get_record_offset() + this.get_sorters()

		// this.set({
		// 	"query": query
		// });

		return query
	},
	get_spatial: function() {

		// fake area value of current map view - we'll compare it to the fake area of the record
		// we want one vector that boosts based on
		var fakeArea = this.get_earth_factor();

		var bounds = LLGOD.boundsFromBBOX(appState.get("bbox"))

		var bbox_west = bounds.getWest()
		var bbox_south = bounds.getSouth()
		var bbox_east = bounds.getEast()
		var bbox_north = bounds.getNorth()

		// some spatial-relavance boosters adjusted from OpenGeoPortal's solr query
		var spatial = '_val_:"product(15.0,recip(sum(abs(sub(product(sub(bbox_east,bbox_west),sub(bbox_north,bbox_south)),' + fakeArea + ')),.01),1,1000,1000))"';
		spatial += ' _val_:"product(3.0,recip(abs(sub(product(sum(bbox_east,bbox_west),.5),0)),1,1000,1000))"';
		spatial += ' _val_:"product(3.0,recip(abs(sub(product(sum(bbox_north,bbox_south),.5),0)),1,1000,1000))"';
		spatial += ' _val_:"product(10.0,map(sum(map(bbox_west,' + bbox_west + ',' + bbox_east + ',1,0),map(bbox_east,' + bbox_west + ',' + bbox_east + ',1,0),map(bbox_south,' + bbox_south + ',' + bbox_north + ',1,0),map(bbox_north,' + bbox_south + ',' + bbox_north + ',1,0)),4,4,1,0))"';

		return spatial

	},
	get_earth_factor: function() {

		var bounds = LLGOD.boundsFromBBOX(appState.get("bbox"))

		var bbox_west = bounds.getWest()
		var bbox_south = bounds.getSouth()
		var bbox_east = bounds.getEast()
		var bbox_north = bounds.getNorth()

		var fakeArea = ((bbox_east - bbox_west) * (bbox_north - bbox_south))

		return fakeArea

	},
	get_record_offset: function() {
		var offset = (appState.get("page") * 25 - 25);
		// this.set({recordOffset:offset});
		return offset;
	}


});

var Activity = Backbone.Model.extend({
	defaults: {
		message: "",
		spin: false
	}
});

var Hit = Backbone.Model.extend({});

var triageCoordz = Backbone.Model.extend({
	defaults: {
		"coordzin": null,
		"type": null
	},
	initialize: function() {
		this.bind("change:coordzin", this.update, this)
	},
	as_choice: function() {

		if (this.get("type") == "radius") {

			var coordz = this.get("coordzin").split(",")
			var lon = coordz[0]
			var lat = coordz[1]
			var rad = coordz[2].split("m")[0] / 1000 //turf wants kilometers but i already committed to taking meters as param
			var pt = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [lon, lat]
				}
			};
			var unit = 'kilometers';
			var buffered = turf.buffer(pt, rad, unit);
			var result = turf.featurecollection([buffered.features, pt]);
			var enveloped = turf.envelope(buffered);
			var west = enveloped.geometry.coordinates[0][0][0]
			var south = enveloped.geometry.coordinates[0][0][1]
			var east = enveloped.geometry.coordinates[0][2][0]
			var north = enveloped.geometry.coordinates[0][2][1]
			var choice = {
				"boundingbox": [
					south,
					north,
					west,
					east
				],
				"geojson": result.features[0][0], //just the buffer
				"lat": lat,
				"lon": lon,
				"display_name": "Custom AOI",
				"category": null,
				"type": this.get("type"),
				"osm_type": "relation" // we are faking this cuzzits the best choice to use in nomin situations
			}

		} else if (this.get("type") == "point") {

			var coordz = this.get("coordzin").split(",")
			var lon = coordz[0]
			var lat = coordz[1]
			var pt = {
				"type": "Feature",
				"properties": {},
				"geometry": {
					"type": "Point",
					"coordinates": [lon, lat]
				}
			};
			var unit = 'kilometers';
			var buffered = turf.buffer(pt, 2.5, unit); // arbitrary - we just wanna put something nice on the map
			var result = turf.featurecollection([buffered.features, pt]);
			var enveloped = turf.envelope(buffered);
			var west = enveloped.geometry.coordinates[0][0][0]
			var south = enveloped.geometry.coordinates[0][0][1]
			var east = enveloped.geometry.coordinates[0][2][0]
			var north = enveloped.geometry.coordinates[0][2][1]
			var choice = {
				"boundingbox": [
					south,
					north,
					west,
					east
				],
				"geojson": pt,
				"lat": lat,
				"lon": lon,
				"display_name": "Custom AOI",
				"category": null,
				"type": this.get("type"),
				"osm_type": "node" // we are faking this cuzzits the best choice to use in nomin situations
			}


		} else if (this.get("type") == "poly") {

			var coordz = this.get("coordzin").split(",")

			var poly = turf.bboxPolygon(coordz);

			var enveloped = turf.envelope(poly);


			var west = Number(enveloped.geometry.coordinates[0][0][0])
			var south = Number(enveloped.geometry.coordinates[0][0][1])
			var east = Number(enveloped.geometry.coordinates[0][2][0])
			var north = Number(enveloped.geometry.coordinates[0][2][1])
			var nudgex = (west - east) * .1 // just a little nudge so users can see the bbox they drew
			var nudgey = (north - south) * .1 // just a little nudge so users can see the bbox they drew

			var choice = {
				"boundingbox": [
					south + nudgex,
					north + nudgey,
					west - nudgey,
					east - nudgex
				],
				"geojson": poly,
				"lat": lat,
				"lon": lon,
				"display_name": "Custom AOI",
				"category": null,
				"type": this.get("type"),
				"osm_type": "relation" // we are faking this cuzzits the best choice to use in nomin situations
			}

		}

		// }

		return choice

	},
	update: function() {

		if (typeof this.get("coordzin") !== 'undefined' && this.get("coordzin") !== null) {
			switch (true) {
				case (this.get("coordzin").split(",").length == 1):
					var typ = "invalid"
					break;
				case (this.get("coordzin").split(",").length == 2):
					var typ = "point"
					break;
				case (this.get("coordzin").indexOf("m") > -1):
					var typ = "radius"
					break;
				case (this.get("coordzin").split(",").length > 2):
					var typ = "poly"
					break;
				default:
					var typ = "invalid"
			}
		}
		this.set({
			type: typ
		})
		return this
	},
});

var TriagePlace = Backbone.Model.extend({
	defaults: {
		"pre": null
	},
	initialize: function() {
		// this.bind("change:type", this.update, this)
		this.bind("change:pre", this.update, this)
	},
	update: function() {
		console.log("in update of TriagePlace")

		console.log("triageplace mod")
		console.log(this)

		if (this.get("pre").type == "aoi_nom") {
			if (this.url() !== null) {
				this.fetch()
			}
		} else {
			this.local()
		}

	},
	local: function() {
console.log("in local of TriagePlace")
		this.set(triageCoordz.as_choice())
		return this

	},
	parse: function(data) {
console.log("in parse of TriagePlace")
		var gj = data[0]
			// this.set({geom:gj.geojson})

		return gj

	},
	url: function() {
		console.log("in url of TriagePlace")
		if (this.get("pre").type == "aoi_nom" && this.get("pre").target !== null) {
			return "http://nominatim.openstreetmap.org/search.php?limit=1&format=jsonv2&polygon_geojson=1" + "&q=" + encodeURIComponent(this.get("pre").target)
		}
		return null
	}
});

var State = Backbone.Model.extend({
	defaults: {
		"downout": "out",
		"slug": "home",
		"bbox": "-149.94140625000003,13.239945499286312,82.44140625000001,66.23145747862573",
		"layers": [],
		"page": "1",
		"apikey": "0",
		"active": null,
		"query": "",
		"active": null,
		"dlex": "map",
		"querytype": null,
		"sessionid": function() {
			var newDate = new Date;
			return this.get("apikey") + "_" + newDate.getTime();
		}
	},
	initialize: function(options) {
		options || (options = {});
		this.bind("change:layers", this.layerize, this)
		// this.bind("change:bbox", this.catchzoomz, this)
		return this
	},
	catchzoomz: function(){

var bbox = this.get("bbox")

// if(typeof appState.changed.bbox !== 'undefined'){
	map.fitBounds(LLGOD.boundsFromBBOX(bbox))
// }

return this

	},
	toggle: function(which) {

		var whi = (typeof which == 'undefined') ? "split" : which;


		switch (this.get("downout")) {
			case "split":
				wh = "out"
				break;
			case "down":
				wh = "out"
				break;
			case null:
				wh = 'nil'
				break;
			default:
				wh = whi
		}

		this.set({
			downout:
				wh
		})

		return this

	},
	layerize: function() { // we don't trust the incoming layers arr to always be clean

		var intr = _.intersection(this.get("layers"), mapBaseLayers.pluck("name")) // get those that happen to be baselayers

		var keepr = intr.length > 0 ? intr[0] : mapBaseLayers.findWhere({
			active: true
		}).get("name"); // keep just the first one or maybe none of them were baselayers
		var scrubd = _.difference(this.get("layers"), mapBaseLayers.pluck("name")) // either way isolate the non-baselayers
		var prepd = [keepr]


		this.set({
			layers: _.union(prepd, scrubd)
		}, {
			silent: true
		});
		if (mapBaseLayers.findWhere({
				active: true
			}).get("name") !== keepr) {
			mapBaseLayers.switch(keepr)
		}

		return this

	},
	pullurl: function() {

var uslug = this.get("slug")
var upage = this.get("page")
var uquery = (this.get("query")==null || this.get("query")=="")?"nil":this.get("query")
var ulayers = (this.get("layers").length>1)?_.unique(this.get("layers")).join():this.get("layers")[0]
var udownout = this.get("downout")
var uactive = (this.get("active")==null || this.get("active")=="")?"nil":this.get("active")
// var uactive = this.get("active")
var ubbox = this.get("bbox")

		var state = "#" + uslug + "/" + upage + "/" + uquery + "/" + ulayers + "/" + udownout + "/" + uactive+ "/" + ubbox

		return state

		// /pullurl
	}
});

var BaseLayer = Backbone.Model.extend({
	defaults: {
		active: false
	},
	initialize: function() {}
});

// var MapLabel = Backbone.Model.extend({});

// var MapLabelsObject = Backbone.Model.extend({
// 	url:function(){
// 		return null
// 	},
// 	initialize: function(options) {
// 		options || (options = {});
// 	}

// });

// var MapLabelsCollection = Backbone.Collection.extend({
// 	model: MapLabel,
// 	url:function(){
// 		return null
// 	},
// 	initialize: function(options) {
// 		options || (options = {});
// 	}

// });

var SwitchLayer = Backbone.Model.extend({});
var Triager = Backbone.Model.extend({});

var Panel = Backbone.Model.extend({
	defaults: {
		active: false
	},
	initialize: function() {}
});

// var BaseMap = Backbone.Model.extend({

// 	initialize: function(){
// 		return this;
// 	}
// });

var Home = Backbone.Model.extend({

	defaults: {}

});

var Util = Backbone.Model.extend({
	initialize: function() {},
	// cleanlayerarray: function(arr){

	// 	console.log("in util, layer arr");
	// 	console.log(arr)

	// which of these are baselayers?

	// if there aren't any, find ask baselayers what its default was

	// otherwise remove all but first

	// return layerarr w/ extraneous baselayers missing

	// return this

	// },
	get_style: function(kind) {

		var po = .65; //poly opacity
		var hitpo = .25; //hit poly opacity

		var randomstyles = [{
			"color": "#394834",
			"fillColor": "#394834",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#486f95",
			"fillColor": "#486f95",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#A64800",
			"fillColor": "#A64800",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#A64800",
			"fillColor": "#A64800",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#260F1C",
			"fillColor": "#260F1C",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#2A2E12",
			"fillColor": "#2A2E12",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#414622",
			"fillColor": "#414622",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#8C510A",
			"fillColor": "#8C510A",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#DFC27D",
			"fillColor": "#DFC27D",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#01665E",
			"fillColor": "#01665E",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#4D4D4D",
			"fillColor": "#4D4D4D",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#e86000",
			"fillColor": "#e86000",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#5e399b",
			"fillColor": "#5e399b",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#b5a221",
			"fillColor": "#b5a221",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}, {
			"color": "#656033",
			"fillColor": "#656033",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po
		}];

		var styleaoi = {
			"color": "white",
			"fillColor": "#3F1A4F",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": po,
			radius: 22
		}

		var stylehit = {
			"color": "white",
			"fillColor": "white",
			"weight": 4,
			"opacity": .9,
			"fillOpacity": hitpo,
			radius: 22
		}
		var stylehithover = {
			"color": "white",
			"fillColor": "white",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": hitpo,
			radius: 22
		}

		var stylehigh = {
			"color": "white",
			"fillColor": "yellow",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": .8,
			radius: 22
		}
		var styledlex = {
			"color": "white",
			"fillColor": "#3F1A4F",
			"weight": 2,
			"opacity": .9,
			"fillOpacity": .5,
			radius: 22
		}

		// var maxh = randomstyles.length;
		// var whichh = _.random(0, maxh);
		// var stylehit=randomstyles[whichh]
		// stylehit.opacity=hitpo
		// stylehit.color="white"


		switch (kind) {
			case "active":
				return stylehigh
				break;
			case "aoi":
				return styleaoi
				break;
			case "hit":
				return stylehit
				break;
			case "dlex":
				return styledlex
				break;
			case "hithover":
				return stylehithover
				break;
			case "styledrawnbox":
				return styledrawnbox
				break;
			default:

				var max = randomstyles.length;
				var which = _.random(0, max);
				return randomstyles[which]

		}



	},
	boundstringFromNOMIN: function(bbox) {

		var bba = bbox

		if (bba.length < 4) {
			return "incomplete bbox submitted"
		}


		var s = bba[0]
		var w = bba[2]
		var e = bba[3]
		var n = bba[1]

		var bboxstring = w + "," + s + "," + e + "," + n

		return bboxstring;

	},
	boundsArrFromBBOX: function(bboxstring){

var bba = bboxstring.split(",")

		if (bba.length < 4) {
			return "incomplete bbox submitted"
		}


		return [bba[0],bba[1],bba[2],bba[3]];

	},
	boundsFromBBOX: function(bboxstring) {

		var bba = bboxstring.split(",")

		if (bba.length < 4) {
			return "incomplete bbox submitted"
		}

		var southWest = L.latLng(bba[1], bba[0]),
			northEast = L.latLng(bba[3], bba[2]),
			bounds = L.latLngBounds(southWest, northEast);


		return bounds;

	}
});
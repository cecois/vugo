var DownloadExtentView = Backbone.View.extend({

	el: null,
	events: {
		// "click li" : "choose"
	},
	initialize: function() {


		// this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.model, 'change', this.render);
		// this.listenTo(appState, 'change:ahit', this.render);
		return this
		.render()

	},
	render: function() {

		groupDLEX.clearLayers()


		var rstyle = LLGOD.get_style("hit")



			gjo = L.geoJson(this.model.get("geom"), {

					style: rstyle,
					pointToLayer: function(feature, latlng) {
						return L.circleMarker(latlng, rstyle);
					}

				})
				.on("mouseover", function(g) {

					console.log("g:"); console.log(g);

					// if (g.layer.feature.properties.did !== appState.get("ahit")) {
					// 	var did = g.layer.feature.properties.did
					// 	// $(".hit-wrapper[data-id='" + did + "']").find(".hit-title").addClass("hit-hover")
					// 	$(".hit-wrapper[data-id='" + did + "']").addClass("hit-hover")
					// 	g.layer.setStyle(LLGOD.get_style("hithover"))
					// }

				}).on("mouseout", function(g) {

					// console.log("this.model:"); console.log(this.model);
					// if (g.layer.feature.properties.did !== appState.get("ahit")) {
					// 	var did = g.layer.feature.properties.did
					// 	// $("#search-hits").find(".hit-wrapper[data-id='" + did + "']>.hit-title").removeClass("hit-hover")
					// 	// $(".hit-wrapper[data-id='" + did + "']>.hit-title").removeClass("hit-hover")
					// 	// $(".hit-wrapper[data-id='" + did + "']").find(".hit-title").removeClass("hit-hover")
					// 	$(".hit-wrapper[data-id='" + did + "']").removeClass("hit-hover")
					// 	g.layer.setStyle(LLGOD.get_style("hit"))
					// }

				})
				.on("click", function(g) {
					var did = g.layer.feature.properties.did
						// g.layer.setStyle(LLGOD.get_style("active"))
					// appState.set({
					// 	ahit: did
					// })


				})
				.addTo(groupDLEX)



			// snap the map to the extent of the whole group (not easy!)
			// map.fitBounds(L.geoJson(turf.bboxPolygon(qbbox)).getBounds())

		// })


		var switcherhash = {
			id: groupDLEX._leaflet_id,
			"name": "groupDLEX",
			type: "dlex",
			label: "Download Extent",
			style: LLGOD.get_style("dlex")

		}
				mapSwitchLayers.push(switcherhash)
		// if(this.length>0){
		// 		mapSwitchLayers.remove(mapSwitchLayers.where({
		// 			type: "hitz"
		// 		}));
		// }
		// map.fitBounds(groupHITZ.getBounds())
		// $(".toolbar-hitz-zoom").attr("data-id",bbox)
		return this
	}

});

var DlexView = Backbone.View.extend({

	el: $("#dlex-button-wrapper"),
	template: Handlebars.templates['DlexSwitcherTpl'],
	events: {
		// "click .search-active-bt-close" : "stfu"
		// "click .search-active-bt-close" : "deactivate"
	},
	initialize: function() {


		// this.listenTo(this.model, 'sync', this.render);
		// this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'change', this.render);
		// this.listenTo(groupAOI,'layeradd',this.switcheryon)
		// this.listenTo(groupAOI,'layerremove',this.switcheryoff)
		// this.listenTo(this.model, 'sync', this.prerender);
		return this
		.render()
	},
	rewire: function(){

var elem = document.querySelector('#dlex-button-toggle');


// if(map.hasLayer(groupAOI) == true) {
if(groupAOI.getLayers().length>0) {

var switchery = new Switchery(elem,{ size: 'small',color: 'yellow'});
					} else {
var switchery = new Switchery(elem,{ size: 'small',color: 'yellow',disabled:true});
					}


return this

	},
	render: function() {

			// triageQueryView.unrender() //if we wanna show the active pane, we'll hide the other overlays


// $(this.el).html(this.template({
// 			aoi_nom: triagePlace.get("display_name").split(",")[0],
// 			this.model.toJSON()
// 		}));

		$(this.el).html(
			this.template(

			this.model.toJSON()

		)
			);


		return this
		.rewire()
	}

});
var ActiveView = Backbone.View.extend({

	el: $("#search-active"),
	template: Handlebars.templates['ActiveViewTpl'],
	events: {
		// "click .search-active-bt-close" : "stfu"
		"click .search-active-bt-close" : "deactivate"
	},
	initialize: function() {


		// this.listenTo(this.collection, 'sync', this.render);
		// this.listenTo(this.model, 'change', this.render);
		// this.listenTo(this.collection, 'change', this.prerender);
		this.listenTo(appState, 'change:active', this.prerender);
		// this.listenTo(this.model, 'sync', this.prerender);
		return this
	},
	prerender: function(){


		// var am = _.findWhere(this.collection,{_id:appState.get("active")})
		var am = this.collection.findWhere({_id:appState.get("active")})

		console.log("am:"); console.log(am);

if(appState.get("active")==null){
	return this.stfu()
} else {
	// this.collection.fetch()
	return this.render()
}

	},
	deactivate: function(){

appState.set({active:null})
return this

	},
	stfu: function(){

			$(this.el).addClass('down')
			return this
	},
	render: function() {

			// triageQueryView.unrender() //if we wanna show the active pane, we'll hide the other overlays



if(typeof this.collection.findWhere({_id:appState.get("active")}) !== 'undefined'){
		$(this.el).html(this.template(this.collection.findWhere({_id:appState.get("active")}).toJSON()));

			$(this.el).removeClass('down')
			}

		return this
	}

});

var QueryMap = Backbone.View.extend({

	el: null,
	events: {
		// "click li" : "choose"
	},
	initialize: function() {


		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, 'change', this.render);
		// this.listenTo(appState, 'change:ahit', this.render);
		return this

	},
	choose: function(e) {



		return this
	},
	render: function() {

		groupHITZ.clearLayers()


		var modz = _.sortBy(this.collection.models, function(m) {

			var w = parseInt(m.get("bbox_west"))
			var s = parseInt(m.get("bbox_south"))
			var e = parseInt(m.get("bbox_east"))
			var n = parseInt(m.get("bbox_north"))

			return (w - e) * (n - s);
		});

		var qarea = turf.area(turf.bboxPolygon([1, 1, 1, 1]))
		var qbbox = null

		_.each(modz, function(m) {


			var w = m.get("bbox_west")
			var s = m.get("bbox_south")
			var e = m.get("bbox_east")
			var n = m.get("bbox_north")

			var bbox = [w, s, e, n];

			var turfpoly = turf.bboxPolygon(bbox);
			var harea = turf.area(turfpoly)

			if (harea > qarea) {
				qarea = harea;
				qbbox = bbox;

			}

			turfpoly.properties = {
				did: m.get("_id"),
				title: m.get("title"),
				format: m.get("format")
			}

// console.log("m in each of render:"); console.log(m);

			var rstyle = (m.get("_id") == appState.get("active")) ? LLGOD.get_style("active") : LLGOD.get_style("hit")



			gjo = L.geoJson(turfpoly, {

					style: rstyle,
					pointToLayer: function(feature, latlng) {
						return L.circleMarker(latlng, rstyle);
					}

				})
				.on("mouseover", function(g) {

					if (g.layer.feature.properties.did !== appState.get("active")) {
						var did = g.layer.feature.properties.did
						// $(".hit-wrapper[data-id='" + did + "']").find(".hit-title").addClass("hit-hover")
						$(".hit-wrapper[data-id='" + did + "']").addClass("hit-hover")
						g.layer.setStyle(LLGOD.get_style("hithover"))
					}

				}).on("mouseout", function(g) {

					if (g.layer.feature.properties.did !== appState.get("active")) {
						var did = g.layer.feature.properties.did
						// $("#search-hits").find(".hit-wrapper[data-id='" + did + "']>.hit-title").removeClass("hit-hover")
						// $(".hit-wrapper[data-id='" + did + "']>.hit-title").removeClass("hit-hover")
						// $(".hit-wrapper[data-id='" + did + "']").find(".hit-title").removeClass("hit-hover")
						$(".hit-wrapper[data-id='" + did + "']").removeClass("hit-hover")
						g.layer.setStyle(LLGOD.get_style("hit"))
					}

				})
				.on("click", function(g) {
					var did = g.layer.feature.properties.did
						// g.layer.setStyle(LLGOD.get_style("active"))
					// appState.set({
					// 	ahit: did
					// })

appState.set({active:(appState.get("active")==did)?null:did})

				})
				.addTo(groupHITZ)



			// snap the map to the extent of the whole group (not easy!)
			// map.fitBounds(L.geoJson(turf.bboxPolygon(qbbox)).getBounds())

		})

		var switchername = (typeof this.collection.findWhere({
			active: true
		}) !== 'undefined') ? "Search Hit Envelopes (1 Active)" : "Search Hit Envelopes";


		var switcherhash = {
			id: groupHITZ._leaflet_id,
			"name": switchername,
			type: "hitz",
			label: "Search Results",
			style: LLGOD.get_style("hit")

		}
		if(this.length>0){
				mapSwitchLayers.remove(mapSwitchLayers.where({
					type: "hitz"
				}));
				mapSwitchLayers.push(switcherhash)
		}
		// map.fitBounds(groupHITZ.getBounds())
		// $(".toolbar-hitz-zoom").attr("data-id",bbox)
		return this
	}

});



var QueryView = Backbone.View.extend({

	el: function() {
		return $("#" + this.id)
	},
	template: Handlebars.templates['QueryViewTpl'],
	template_split: Handlebars.templates['QueryViewSplitTpl'],
	events: {
		"mouseover li": "lighten",
		"mouseout li": "darken",
		"click .toolbar-hitz-zoom": "zoom",
		"click .toolbar-hitz-hide": "hide"
			// "click li" : "choose"
	},
	initialize: function() {


		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(appState, 'change:downout', this.render);
		return this
		// var moptions={keyboard:true,show:false}; $("#triageContainer").modal(moptions);
		// this.render()
	},
	hide: function(e){


(map.hasLayer(groupHITZ)==true)?map.removeLayer(groupHITZ):map.addLayer(groupHITZ)

// either way we want any AOIs to be front
groupAOI.bringToFront()

$('.toolbar-hitz-hide').toggleClass("on")
return this

	},
	zoom: function(e){

qarea = 0;
groupHITZ.eachLayer(function(l){

var bbox = LLGOD.boundsArrFromBBOX(l.getBounds().toBBoxString())

var poly = turf.bboxPolygon(bbox);

var area = turf.area(poly);

if(area>qarea)
{qarea=area
map.fitBounds(LLGOD.boundsFromBBOX(l.getBounds().toBBoxString()))}

});

return this
	},
	darken: function(e) {

		var d_d = $(e.currentTarget).attr("data-id")

		// $(e.currentTarget).find(".hit-title").removeClass("hit-hover")
		$(e.currentTarget).removeClass("hit-hover")

		groupHITZ.eachLayer(function(L) {


			if (L.toGeoJSON().features[0].properties.did == d_d) {


				if (appState.get("active") == d_d) {
					L.setStyle(LLGOD.get_style("active"))
				} else {

					L.setStyle(LLGOD.get_style("hit"))
				}
			}

		})

		return this
	},
	lighten: function(e) {

		var d_d = $(e.currentTarget).attr("data-id")

		// $(e.currentTarget).find(".hit-title").addClass("hit-hover")
		$(e.currentTarget).addClass("hit-hover")

		groupHITZ.eachLayer(function(L) {


			// if(L.toGeoJSON().features[0].properties.did == d_d){L.setStyle(LLGOD.get_style("hithover"))}
			if (L.toGeoJSON().features[0].properties.did == d_d) {

				// var styleog = L.options.style

				// console.log("styleog:"); console.log(styleog);

				L.setStyle(LLGOD.get_style("hithover"))
			}

		})



		return this

	},
	unrender: function() {

		$('#triageContainer').addClass('hidden')
		$(this.el).addClass('hidden')

		return this


	},
	choose: function(e) {


		var typ = $(e.currentTarget).find("span").attr("data-id")
		var target = $(e.currentTarget).find("span").attr("data-target")
		var bbox = $(e.currentTarget).find("span").attr("data-bbox")

		this.unrender()

		var arr = {
			type: typ,
			"target": target,
			"fallback": bbox
		}

		// appActivity.set({message:"processing AOI (area of interest) as : "+arr.target})


		triagePlace.set({
			pre: arr
		})


		return this
	},
	render: function() {


		var title = (this.collection.length > 0) ? "RESULTS (" + this.collection.length + " total):" : "(no query results)";



if(appState.get("downout")=='split'){

$(this.el).html(this.template_split({
			count: this.collection.models.length,
			rows: this.collection.toJSON(),
			title: title
		}));

} else {
		$(this.el).html(this.template({
			count: this.collection.models.length,
			rows: this.collection.toJSON(),
			title: title
		}));}
		return this
	}

});


var BaseMapsMenuView = Backbone.View.extend({
	tagName: "ul",
	el: "#menu-basemaps-wrapper",
	events: {
		"click .mnu-basemap-item": "switch",
	},
	template: Handlebars.templates['baseMapsMenuViewTpl'],
	initialize: function() {

		this.collection.bind('change:active', this.render, this);
		this.render()
	},
	switch: function(e) {

		var n = $(e.currentTarget).attr("data-id")

		var aslz = appState.get("layers")

		var newaslz = _.reject(aslz, function(l) { //get rid of the one(s) that are baselayers cuz we gonna add a fresh one
			return _.contains(mapBaseLayers.pluck("name"), l)
		});

		// aslz.push(n)
		newaslz.push(n)
		appState.set({
			layers: newaslz
		});
		// this.collection.switch(n)

		return this

	},
	render: function() {
		$(this.el).html(this.template({

			rows: this.collection.toJSON()

		}));
	}
});

var ActivityView = Backbone.View.extend({
	el: $("#activityContainer"),
	template: Handlebars.templates['activityViewTpl'],
	events: {
		"click .activity-cancel": "stfu",
	},
	initialize: function() {

		NProgress.configure({
			parent: "#activityContainer",
			showSpinner: false
		});

		this.model.bind("change", this.render, this);
		// this.render();
	},
	stfu: function() {
		NProgress.done()
		$(this.el).addClass("idle")
			// $("#inputSearch").removeClass("hidden")
		$("#activityWrapper").addClass('hidden')

		$(this.el).removeClass('warn')


		return this
	},
	warn: function() {

		NProgress.done()

		$(this.el).addClass('warn')

		setTimeout(_.bind(this.stfu, this), 4000);

		return this

	},
	render: function() {
		if (this.model.get("message") == null) {
			return this.stfu()
		}
		console.log("rendering activityview")
		NProgress.start();

		$(this.el).removeClass("idle")
		$("#activityWrapper").removeClass('hidden')
			// $("#inputSearch").addClass("hidden")

		$(this.el).html(this.template(
			this.model.toJSON()
		))

		return this

	}
});

var AOIMapView = Backbone.View.extend({
	el: null,
	events: {},
	initialize: function() {


		this.listenTo(this.model, 'change', this.render)


		return this
	},

	render: function() {


		groupAOI.clearLayers() // only one of these in groupAOI at once



		if (this.model.get("boundingbox")) {

			appState.set({
				bbox: LLGOD.boundstringFromNOMIN(this.model.get("boundingbox"))
			});
		} else {
			appConsole.set({
					message: "No bounding box from Nominatim - couldn't zoom to the AOI"
				}) // incoming geojson bounding box only becomes appState zoomy
		}


		var rstyle = LLGOD.get_style("aoi") //pull the aoi style from our universal utility model

		// var moptions = {
		// 	radius: 18,
		// 	fillColor: "#ff7800",
		// 	color: "#000",
		// 	weight: 1,
		// 	opacity: 1,
		// 	fillOpacity: 0.8
		// };

		var gjo;

		gjo = L.geoJson(this.model.get("geojson"), {

			style: rstyle,
			pointToLayer: function(feature, latlng) {
				return L.circleMarker(latlng, rstyle);
			}

		}).addTo(groupAOI)


var anom = (this.model.get("geojson").type.toLowerCase()=='point')?"estimated area around "+this.model.get("display_name"):this.model.get("display_name")
var atyp = (this.model.get("geojson").type.toLowerCase()=='point')?"aoi_point":"aoi"

appState.set({dlex:atyp}) //this stores in appstate the geom we'll use to clip download jobs - IMPORTANT!

		var switcherhash = {
			id: gjo._leaflet_id,
			"name": anom,
			type: atyp,
			label:"AOI (area of interest)",
			style: rstyle
		}
		mapSwitchLayers.remove(mapSwitchLayers.where({
			type: "aoi"
		}));
		mapSwitchLayers.remove(mapSwitchLayers.where({
			type: "aoi_point"
		}));
		mapSwitchLayers.push(switcherhash)


		var labeltitle = "<h5>" + this.model.get("display_name") + "</h5>"
		var labelattrib = (this.model.get("pre").type == "aoi_nom") ? "<div class='anno'>(source: <a href='http://nominatim.openstreetmap.org/'>nominatim.openstreetmap.org</a>)</div>" : "<div class='anno'>(source: user-supplied</a>)</div>"

		var labelcopy = labeltitle + labelattrib



		var label = L.popup({
				className: 'popup-non',
				closeButton: false,
				autoPan: false
			})
			.setLatLng(L.latLng(this.model.get("lat"), this.model.get("lon")))
			.setContent(labelcopy)
			.openOn(map) // some funny business from that time when leaflet.label stopped working - we take the lat and lon from the nominatim geojson and we manually drop a entirely-stripped-of-style leaflet popup - looks like a label and disappears in that popupy kinda way

		gjo.bringToFront()

		appActivityView.stfu()

		// appState.set({downout:"down"}) //not sure how much we wanna dictate app state, but if ppl are searching for places they prolly wanna see em

		return this
	}
});

var TriageQueryView = Backbone.View.extend({

	el: function() {
		return $("#" + this.id)
	},
	template: Handlebars.templates['triageQueryViewTpl'],
	events: {
		"click li": "choose"
	},
	unrender: function() {

		console.log("unrendering triagequeryview")
		$('#triageContainer').addClass('hidden')
		$(this.el).addClass('hidden')

		return this


	},
	choose: function(e) {


		var aid = $(e.currentTarget).find("span").attr("data-id")

		this.unrender()

		appState.set({active:aid,slug:"search"})


		return this
	},
	initialize: function() {


		this.listenTo(this.collection, 'sync', this.render);
		// var moptions={keyboard:true,show:false}; $("#triageContainer").modal(moptions);
		// this.render()
		return this
	},
	render: function() {

		appActivity.set({
			message: null
		})



		var title = (this.collection.length > 0) ? "TOP 10 DATASET MATCHES:" : "TOP DATASETS: (no matches)";

// if(appState.get("query")!=="" && appState.get("query")!==null){
$('#triageContainer').removeClass('hidden')
		$(this.el).removeClass('hidden')
	// }

		$(this.el).html(this.template({
			count: this.collection.models.length,
			rows: this.collection.toJSON(),
			title: title
		}));
		return this
	}

});

var TriageCollectionView = Backbone.View.extend({

	el: function() {
		return $("#" + this.id)
	},
	template: Handlebars.templates['triageCollectionViewTpl'],
	events: {
		"click li": "choose"
	},
	initialize: function() {
		console.log("in initialize of TriageCollectionView")


		this.listenTo(this.collection, 'add', this.render);
		this.listenTo(this.collection, 'reset', this.render);
		// this.listenTo(this.collection, 'sync', this.render);
		// var moptions={keyboard:true,show:false}; $("#triageContainer").modal(moptions);
		// this.render()
		return this
	},
	unrender: function() {
		console.log("in unrender of TriageCollectionView")

		$('#triageContainer').addClass('hidden')
		$(this.el).addClass('hidden')

		return this


	},
	choose: function(e) {
		console.log("in choose of TriageCollectionView")


		var typ = $(e.currentTarget).find("span").attr("data-id")
		var target = $(e.currentTarget).find("span").attr("data-target")
		var bbox = $(e.currentTarget).find("span").attr("data-bbox")

		this.unrender()

		var arr = {
			type: typ,
			"target": target,
			"fallback": bbox
		}

		appActivity.set({
			message: "processing AOI (area of interest) as : " + arr.target
		})


		triagePlace.set({
			pre: arr
		})


		return this
	},
	render: function() {
		console.log("in render of TriageCollectionView")

		appActivity.set({
			message: null
		})

		var title = (this.collection.length > 0) ? "PLACES/AREAS OF INTEREST:" : "(no matching places/AOIs)";



if(this.collection.models.length>0){ //if we don't have any, we don't want that overlay annoying everybody

$('#triageContainer').removeClass('hidden')
		$(this.el).removeClass('hidden')
	}

		$(this.el).html(this.template({
			count: this.collection.models.length,
			rows: this.collection.toJSON(),
			title: title
		}));

		return this
	}

});


/*
bit of a cheat - we have a view here that can control all super app elements that are not otherwise modeled themselves (e.g. panestate, url, etc.)
*/

var SearchView = Backbone.View.extend({
	el: $("#inputSearch"),
	template: Handlebars.templates['searchFormViewTpl'],
	events: {
		"keyup": "delay",
		"click #bt-query": "execute_by_click"
	},
	initialize: function() {
		this.render()
		this.model.bind("change:query", this.render, this)
		this.listenTo(appState, 'change:query', this.prequery);
		return this
	},
	execute_by_click: function(){

var qv = $(this.el).find("#inputContainer input").val()

$("#triageContainer").toggle()

		appState.set({
			query: qv,
			slug:"search"
		})
		return this


	},
	render: function() {
		$(this.el).html(this.template(this.model.toJSON()))
		return this
	},
	delay: function(event) { //  tnx http://stackoverflow.com/questions/6756381/jquery-backbone-js-delay-function-call
		var self = this;
		if (self.timer)
			clearTimeout(self.timer);
		self.timer = setTimeout(function() {

			self.preprequery()

			self.timer = null;
		}, 500);

		return this
	},
	preprequery: function(g) {
		var qv = $(this.el).find("#inputContainer input").val()

		appState.set({
			query: qv
		})
		return this
	},
	prequery: function(g) {

		// var qv = $(this.el).find("#inputContainer input").val()

		// appState.set({query:qv})

		var qv = appState.get("query")

		switch (true) { //let's try to catch coordinate input
			case (!isNaN(qv.split(",")[0]) && !isNaN(qv.split(",")[1]) && (qv.split(",").length > 2 && qv.split(",")[2].indexOf("m") > -1)):
				var typ = "coords" //point with a 3rd param - radius in meters
				break;
			case (qv.split(",").length == 1):
				var typ = "string"
				break;
			case (_.every(qv.split(","), function(c) {
				return !isNaN(c)
			})):
				var typ = "coords" //poly
				break;
			default:
				var typ = "string"
		}

		if (typ == "coords") { //if these are coordinates, we are gonna pass in quite a different object (e.g. not a nominatim geom but a custom)

			triageCoordz.set({
				coordzin: qv
			})

			var element = triageCoordz.as_choice()


			triagePlaces.reset()

			var llgodelement = element
			llgodelement.llgod_type = "aoi_custom"
			triagePlaces.push(llgodelement)



			return this
		} else {


			var service_url = 'http://nominatim.openstreetmap.org/search.php?limit=5&format=jsonv2&q=' + qv;
			// var solr_url = 'http://libgeo:8080/search.php?limit=5&format=jsonv2&q='+qv;


			triagePlaces.reset()

			// TEMPORARY DISABLED SO WE DON'T HIT NOMINATIM TOO HARD DURING TESTING

			$.getJSON(service_url, null, function(response) {
				$.each(response, function(i, element) {
					var llgodelement = element
					llgodelement.llgod_type = "aoi_nom"
						// triagePlaces.push(element)
					triagePlaces.push(llgodelement)
				});
			});



			return this
		} //wasn't coords - we propogate the query string to nominatim and solr
	}
})


var StateView = Backbone.View.extend({

	el: $("body"),
	events: {
		"click #paneToggler-split": "togglesplit",
		"click #paneToggler-down": "toggledown"
	},
	initialize: function() {
		// this.model.bind("change:layers", this.validate, this)
		this.model.bind("change", this.render, this)
			// this.model.bind("bbox", this.render, this)
		this.listenTo(map, 'moveend', this.bboxup);
		return this
	},
	togglesplit: function(e) {

		e.preventDefault();

		this.model.toggle("split")

		return this

	},
		toggledown: function(e) {

		e.preventDefault();

		this.model.toggle("down")

		return this

	},
	bboxup: function() {

		var bbox = map.getBounds().toBBoxString()

		if (bbox !== this.model.get("bbox")) {
			this.model.set({
				bbox: bbox
			})
		}

		return this

	},
	render: function(a) {


		switch (this.model.get("downout")) {
			case "down":
				$("#paneContainer").removeClass('split');
				$(".homeli").removeClass('split'); //gross but bootstrap responsive didn't work on these manual resizes
				$(".hit-wrapper").removeClass('split'); //gross but bootstrap responsive didn't work on these manual resizes
				$("#paneContainer").addClass('down');

				$("#paneToggler-down").addClass('down');
				$("#paneToggler-split").removeClass('split');
				break;
			case "split":
				$("#paneContainer").removeClass('down');
				$("#paneContainer").addClass('split');
				$(".homeli").addClass('split'); //gross but bootstrap responsive didn't work on these manual resizes
				$(".hit-wrapper").addClass('split'); //gross but bootstrap responsive didn't work on these manual resizes

				$("#paneToggler-down").removeClass('down');
				$("#paneToggler-split").addClass('split');
				break;
			case null:

				break;
			default:
				$("#paneContainer").removeClass('down');
				$("#paneToggler-down").removeClass('down');
				$("#paneContainer").removeClass('split');
				$("#paneToggler-split").removeClass('split');
				$(".homeli").removeClass('split'); //gross but bootstrap responsive didn't work on these manual resizes
				$(".hit-wrapper").removeClass('split'); //gross but bootstrap responsive didn't work on these manual resizes
		}

		// if(this.model.get("downout")=="down"){
		// 	$("#paneContainer").addClass('collapsed');
		// 	$("#paneToggler").addClass('collapsed');
		// 	// $("#triageContainer").addClass('hidden');
		// } else {
		// 	// $("#triageContainer").removeClass('hidden');
		// 	$("#paneContainer").removeClass('collapsed');
		// 	$("#paneToggler").removeClass('collapsed');
		// }


		$(document).attr("title", "LL GeoData: " + appState.get("slug"));

		if (typeof appRoute !== 'undefined') {
			appRoute.navigate(this.model.pullurl());
		}
		return this

	}

});

var PanelMenuView = Backbone.View.extend({

	el: $("#navContainer .tabbable .nav-tabs"),
	template: Handlebars.templates['panelMenuViewTpl'],
	events: {
		"click li": function(e) {
			var pid = $(e.currentTarget).attr("data-id")
			appState.set({
				slug: pid
			})
		}
	},
	initialize: function() {
		this.listenTo(appState, 'change', this.render);
		return this.render()
	},
	render: function() {

		$(this.el).html(this.template(this.collection.toJSON()))
		return this
			.subrender()
	},
	subrender: function() {


		var target = appState.get("slug")

		$("#paneContainer").find(".tab-pane").removeClass("active")
		$("#paneContainer").find("#" + target).addClass("active");

		return this

	}

});

var BaseMapView = Backbone.View.extend({

	id: "map",
	initialize: function() {
		// map.setMaxBounds(LLGOD.boundsFromBBOX("-180,-90,180,90"))
		this.listenTo(appState, 'change:bbox', this.zoom)
		this.listenTo(this.collection, 'change:active', this.render)
		return this.render()
	},
	zoom: function() {

		if ((appState.get("bbox") !== null) && typeof appState.get("bbox") !== 'undefined' && map.getBounds().toBBoxString() !== appState.get("bbox")) {
			map.fitBounds(LLGOD.boundsFromBBOX(appState.get("bbox")))
		}

	},
	render: function() {

		var am = this.collection.findWhere({
			active: true
		});
		var def = am.get("definition");

		// remove global layer here first so we don't keep stacking baselayers
		// (we only need one baselayer at a time, of course)
		if (typeof baseLayer == 'undefined') {
			baseLayer = null;
		} else {
			map.removeLayer(baseLayer);
		}
		// a little special handling for stamen maps
		if (am.get("source") == "stamen") {

			baseLayer = new L.StamenTileLayer(def.id);

			appConsole.set({
				message: "Basemap switched to " + am.get("nom") + ", which might have zoom restrictions"
			})

		} else if (def.subdomains != undefined) {

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
			.zoom()

	}



});

var HomeView = Backbone.View.extend({

	el: $("#home"),
	template: Handlebars.templates['HomeViewTpl'],
	initialize: function() {
		this.model.bind("change", this.render, this)
		return this
	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()))
		return this.rewire()
	},
	specialize: function() {

		$(this.el).find("#btSpecial").tooltip();

		$(this.el).find("#btSpecial").click(function(e) {

			e.preventDefault()

			if ($(e.currentTarget).hasClass("on")) {
				special.setOpacity(0)
				$(e.currentTarget).removeClass("on")
			} else {
				$(e.currentTarget).addClass("on")
				special.setOpacity(1)
			}

		})

		return this

	},
	rewire: function() {


		// Assign handlers immediately after making the request,
		// and remember the jqxhr object for this request
		var c3url = "../api/v1/rss/relay/c3"
			// $(this.el).find("#c3latest").html('<img src="images/subset-throbber.gif" height="15px" width="15px"><p>pulling latest c3 blog post...</p>');

		// $.getJSON(c3url, {}).done(function(post) {

		// 	if (typeof post !== 'undefined') {
		// 		var updated = post.updated;
		// 		var title = post.title;
		// 		var link = post.link;

		// 		var timeobj = new Time(updated);
		// 		var t = timeobj.format('l' + ", " + 'F' + ' ' + 'j');

		// 		var conc = "LATEST FROM C3: <a href='" + link + "'>" + title + "</a> <span class='anno'><em>posted " + t + "</em></span>";
		// 		//
		// 		$("#c3latest").html(conc);
		// 	} else {
		// 		$("#c3latest").html("failed to fetch latest <a href='https://c3.llan.ll.mit.edu/blogs/249650e6-9c85-498a-bd0d-59b7b602623a/?lang=en_us'>c3 blog</a> post");
		// 	}

		// });



		$(this.el).find("#homereset").popover({
			placement: "top",
			content: "Remove this error message.",
			trigger: "hover",
			container: 'body'
		});

		$("#homereset").click(function() {
			appHome.unset("homeerror");
			$(".popover").hide();
		});

		$(".contact-trigger").click(function() {

			emailContact = new Contact().set({
				message: ""
			});

			emailContactView = new ContactView({
				model: emailContact
			});

			$('#contactContainer').modal('show')

		});

		return this.specialize()
	}

});

var SwitcherView = Backbone.View.extend({

	el: $("#footer-layer-switcher"),
	template: Handlebars.templates['layersSwitcherViewTpl'],
	events: {
		"click .switcher-button-zoom": "zoom",
		"click .switcher-button-onoff": "onoff",
		// "click li": function(e)
	},
	initialize: function() {
		this.listenTo(this.collection, 'add', this.render);
		this.listenTo(map, 'layerremove', this.render);
		// this.render()
		return this
	},
	zoom: function(e){

var pid = $(e.currentTarget).attr("data-id")
			var ptyp = $(e.currentTarget).attr("data-type")

if(ptyp=="aoi_point"){

map.fitBounds(LLGOD.boundsFromBBOX(LLGOD.boundstringFromNOMIN(triagePlace.get("boundingbox"))))

} else {

map.fitBounds(groupAOI.getBounds())}
		return this
	},
	onoff: function(e){

			// $(e.currentTarget).toggleClass("on")
			var pid = $(e.currentTarget).attr("data-id")
			var ptyp = $(e.currentTarget).attr("data-type")

			switch (ptyp) {
				case "aoi":
				case "aoi_point":
					if (map.hasLayer(groupAOI) == true) {
						groupAOI.removeFrom(map);
						map.closePopup();
					} else {
						groupAOI.addTo(map);
						this.render()
					}

					break;
				case "hitz":
					if (map.hasLayer(groupHITZ) == true) {
						groupHITZ.removeFrom(map);
						map.closePopup();
					} else {
						groupHITZ.addTo(map);
						this.render()
					}
					break;
				default:
					console.log("boring!")
			}


			return this
		},
	upd: function(u) {
		return this
			.render()
	},
	render: function() {

		console.log("renderin switcherview")
		if (this.collection.length > 0) {

			$(this.el).removeClass('hidden')

			$(this.el).html(this.template({
				layers: this.collection.toJSON(),
				share: parseInt(this.collection.length)/12
			}));

		}
		return this
	},

});


// var triageCoordzView = Backbone.View.extend({
// 	el: null,
// 	events: {},
// 	initialize: function() {

// 		// this.listenTo(this, 'change:type', this.render)

// 		return this
// 	},
// 	prep_geom: function(){


// 		if(this.get("type")=="radius"){

// 			var co = this.get("coordz")
// 			L.circle(
// 			{
// 				lat:co[1],
// 				lon:co[0]
// 			},
// 			co[2].split("m")[0],
// 			{
// 				color: 'red',
// 				fillColor: 'white',
// 				fillOpacity: 0.85
// 			}).addTo(map).bindPopup("(custom aoi)");
// 		}

// 		return this

// 	},
// 	render: function() {

// 		console.log("in render of triageCoordzView")


// 		$('#triageContainer').removeClass('hidden')
// 		$(this.el).removeClass('hidden')
// 		$(this.el).html("we think these are coords - y?");
// 		return this
// 	},
// 	choose: function(){

// 		groupAOI.clearLayers()

// 		L.geoJson(this.collection.toJSON(), {

// 			onEachFeature: function(FE,LA){

// 				LA.bindLabel('Look revealing label!')

// 			}
// 		}).addTo(groupAOI);



// 		return this

// 	}

// })

// var QueryActiveMap = Backbone.View.extend({

// 	el: null,
// 	events: {
// 		// "click li" : "choose"
// 	},
// 	initialize: function() {


// 		// this.listenTo(this.collection, 'sync', this.render);
// 		// this.listenTo(this.collection, 'change', this.render);

// 	},
// 	render: function() {

// 		console.log("in render of queryactive")
// 		groupACTIVZ.clearLayers()

// 		// var modz = _.findWhere(this.collection.models, { active:true });
// 		var moda = this.collection.findWhere({ active:true });
// 		// var moda = this.collection.models[1]


// 		var w = moda.get("bbox_west")
// 		var s = moda.get("bbox_south")
// 		var e = moda.get("bbox_east")
// 		var n = moda.get("bbox_north")

// 		var bbox = [w,s,e,n];

// 		var turfpoly = turf.bboxPolygon(bbox);


// 		turfpoly.properties={
// 			did:moda.get("_id"),
// 			title:moda.get("title"),
// 			format:moda.get("format")
// 		}


// 		var rstyle = LLGOD.get_style("active")

// 		gjo = L.geoJson(turfpoly , {

// 			style: rstyle,
// 			pointToLayer: function (feature, latlng) {
// 				return L.circleMarker(latlng, rstyle);
// 			}

// 		})
// 		.addTo(groupACTIVZ)


// 		return this
// 	}

// });
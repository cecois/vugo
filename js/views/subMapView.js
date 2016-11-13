var subMapView = Backbone.View.extend({

	// id: "submap",

	initialize: function() {

	},

	unrender: function(){

		submap.removeLayers(bboxrect);
		submap=null;

		return this

	},

	render: function() {

		var submap = new L.Map(this.el, {
			zoomControl: false,
			center: [51.505, -0.09],
			attributionControl: false,

			zoom: 2
		});

		// let's just hard-wire the gray cloudmade here
L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/22677/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(submap);

// var bboxrect = new L.rectangle(this.options.envelope, {color: "#ff7800", weight: 1})
// bboxrect.addTo(submap);


// zoom the map to the rectangle bounds
// submap.fitBounds(this.options.envelope);

// but then bump it a little further out for better context
// var z = submap.getBoundsZoom(this.options.envelope);
// var c = submap.getCenter();
// submap.setView(c,z-1);


	return this
	}



});
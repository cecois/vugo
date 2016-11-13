var specials = new L.layerGroup().addTo(map);

//
/* --------------------------------------------- 201411 --------------------------------------- */
// var specialLayer = L.tileLayer.wms("http://libgeo:8080/geoserver/gwc/service/wms", {
//     layers: 'specials:201411_turkey_inventory',
//     format: 'image/png',
//     transparent: true,
//     opacity:.8
// });//
/* --------------------------------------------- 201412 --------------------------------------- */
// var specialLayer = L.tileLayer.wms("http://libgeo:8080/geoserver/gwc/service/wms", {
//     layers: 'specials:201412_snow_cover',
//     format: 'image/png',
//     transparent: true,
//     opacity:.8
// });

/* --------------------------------------------- 201501a START --------------------------------------- */
/* --------------------------------------------- 201501a
// var specialLayer = L.layerGroup();
var trailA = {
	// potential - copper
		"color": "#704400",
  "fillColor": "#704400",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	}
var trailC = {
	// considered - purple
		"color": "#6e0073",
  "fillColor": "#6e0073",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	}
var trailE = {
	// existing - red
		"color": "#95020e",
  "fillColor": "#95020e",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	}
var trailI = {
	// existing - unimproved - pink
		"color": "#9d00a1",
  "fillColor": "#9d00a1",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	}
var trailR = {
	// on-road connection - gray
		"color": "#9ea3a3",
  "fillColor": "#9ea3a3",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	}
var trailU = {
	// underway - green
		"color": "#1d9914",
  "fillColor": "#1d9914",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	}


function pullStyle(feature){

 switch (feature.properties.TRAIL_STAT) {
   case "U":
   var style = trailU;

      break;
   case "A":
   var style = trailA;

      break;
   case "R":
   var style = trailR;

      break;
   case "I":
   var style = trailI;

      break;
         case "C":
         var style = trailC;

      break;
   case "E":
   var style = trailE;

      break;
   default:
      console.log("boring!")
}
return style
}

function onEachFeature(feature, layer) {

      var popupContent = feature.properties.TRAILNAME;

      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;

      }

      layer.bindPopup(popupContent);
    }

// var massurl = "http://giswebservices.massgis.state.ma.us/geoserver/wfs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=massgis:GISDATA.BIKETRAILS_ARC&SRSNAME=EPSG:4326&outputFormat=json";

// appActivity.set({spin: true,message: "pulling the special from MassGIS...",caller:"special"});

var speshl = $.getJSON( spurl, function( data ) {

        var gj = L.geoJson(data, {
        	style: {
		"color": "#95020e",
  "fillColor": "#95020e",
		"weight": 3,
		"opacity": .9,
		"fillOpacity":.8
	},
      onEachFeature: onEachFeature
    }).addTo(specialLayer).bringToFront()

appActivityView.reset()
return data

});
 END --------------------------------------- */

/* ------------- SEASONAL ---------------------------------------- */

function addSpecials201501b(){

// layer for gag maps
// var specials = new L.layerGroup().addTo(map);


/* --------------------------------------------- 201501b START
var specialLayer = L.tileLayer.wms("http://libgeo:8080/geoserver/gwc/service/wms", {
    layers: 'specials:201501_mlk',
    format: 'image/png',
    transparent: true,
    opacity:.8
}).addTo(specials).bringToFront();

201501b END --------------------------------------- */


map.setView([43.67582,-94.96582],4);


$("#btSpecial").tooltip();

$("#btSpecial").click(function(e){
	e.preventDefault()

	if(_.toArray(specials._layers).length>0){
		// the thing is on, turn it offf
	// specials.removeLayer(specialLayer)
	toggleSpecial(false)
	} else {
	// specials.addLayer(specialLayer)
toggleSpecial(true)

	}
})


} //addSpecials201501b

function addSpecials(){

function pullStyle(feature){


var heartIcon = L.icon({
    iconRetinaUrl: 'images/special-marker-heart.png',
    iconUrl: 'images/special-marker-heart.png',
    iconSize: [34, 34],
    iconAnchor: [10, 10],
    popupAnchor: [3, -3],
    // shadowUrl: 'images/special-marker-heart-shadow.png',
    // shadowRetinaUrl: 'my-icon-shadow@2x.png',
    // shadowSize: [20, 20],
    // shadowAnchor: [3, 5]
});


var specialStyle = {

icon: heartIcon

}

return specialStyle;

}

function onEachFeature(feature, layer) {

      var popupContent = feature.properties.TRAILNAME;

      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;

      }

      layer.bindPopup(popupContent);
    }

var specialLayer = L.featureGroup().addTo(map);
    // .bindPopup(
    // 	function(p){
    // 		console.log("p:"); console.log(p);
    // 	}
    // 	)// bindpopup
    // .on('click', function(t) {
    // 	console.log("t:"); console.log(t);
    // 	this.openPopup()
    // })


// var spurl = "http://api.geonames.org/searchJSON?q=%22mount%20vernon%22&maxRows=5&username=enormlllar";
var spurl = 'http://api.geonames.org/searchJSON?name="love"&name="cupid"&name="valentine"&name="heart"&name="romance"&operator=OR&username=enormlllar';

// appActivity.set({spin: true,message: "pulling the special from MassGIS...",caller:"special"});

var speshl = $.getJSON( spurl, function( data ) {


_.each(data.geonames,function(d){

var ll = L.latLng(d.lat, d.lng);

var pu = d.name+", "+d.adminCode1+ ' (<a href="http://www.geonames.org/'+d.geonameId+'">geonames</a> class: '+d.fcode+")"

// var lm = L.marker(ll).addTo(specialLayer).bindPopup(pu);
var lm = L.marker(ll,pullStyle(d)).addTo(specialLayer).bindPopup(pu);
// var lm = L.circleMarker(ll,pullStyle(d)).addTo(specialLayer).bindPopup(pu);

})

map.fitBounds(specialLayer.getBounds());
return data

});

// we start with the special map on
function toggleSpecial(which)
{

	switch(which) {
    case true:
specials.addLayer(specialLayer);
specialLayer.bringToFront()
	$("#btSpecial").addClass("on")

        break;
    case false:
specials.removeLayer(specialLayer);
	$("#btSpecial").removeClass("on")
        break;
    default:
        // default code block
}

}


$("#btSpecial").tooltip();

$("#btSpecial").click(function(e){
	e.preventDefault()

	if(_.toArray(specials._layers).length>0){
		// the thing is on, turn it offf
	// specials.removeLayer(specialLayer)
	toggleSpecial(false)
	} else {
	// specials.addLayer(specialLayer)
toggleSpecial(true)

	}
})

toggleSpecial(true)
} //addSpecials

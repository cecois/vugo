var specials = new L.layerGroup().addTo(map);

map.fitBounds([
    [-6.140554782450295, -149.4140625],
    [68.72044056989829, 141.85546875]
]);


/* ------------- SEASONAL ---------------------------------------- */


function addSpecials(){


function pullStyle(feature){


var heartIcon = L.icon({
    iconRetinaUrl: 'images/special-tree-xmas.png',
    iconUrl: 'images/special-tree-xmas.png',
    iconSize: [24, 24],
    iconAnchor: [10, 10],
    popupAnchor: [3, -3]
    // shadowUrl: 'images/special-marker-heart-shadow.png',
    // shadowRetinaUrl: 'my-icon-shadow@2x.png',
    // shadowSize: [20, 20],
    // shadowAnchor: [3, 5]
});


var specialStyle = {

icon: heartIcon,opacity:.7

}

return specialStyle;

}

var specialLayer = L.featureGroup().addTo(map);
var speshl = $.getJSON( 'js/201512_naics_trees.geojson', function( data ) {


_.each(data.features,function(d){

var ll = L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);

var pu = d.properties.city+" ("+d.properties.number+")"


// var lm = L.marker(ll).addTo(specialLayer).bindPopup(pu);
var lm = L.marker(ll,pullStyle(d)).addTo(specialLayer).bindPopup(pu);
// var lm = L.circleMarker(ll,pullStyle(d)).addTo(specialLayer).bindPopup(pu);

})

if(Backbone.history.fragment.indexOf('perdisc')>=0){
  appConsole.set({message:"In #perdisc requests we don't zoom to any possible special overlays we might be featuring."})
}else{
map.fitBounds(specialLayer.getBounds());
}

return data

});

// var nwsurl = "http://preview.weather.gov/graphical/scripts/get_multivt.php?";
  // $.getJSON( nwsurl, {
  //   grid: 'ndfd',elmt: 'totalsnowamt',region:'conus'
  // })
  //   .done(function( data ) {
  //       console.log("get date array:")
  //       var pj = $$.parseJSON(data);
  //       // console.log(pj)
  //       alert(pj)
  //   });


// $.ajax({
//    type: 'GET',
//     url: nwsurl,
//     async: false,
//     jsonpCallback: '?',
//     grid: 'ndfd',elmt: 'totalsnowamt',region:'conus',
//     contentType: "application/json",
//     dataType: 'jsonp',
//     success: function(json) {
//     console.log("success")
//        console.dir(json);
//     },
//     error: function(e) {
//     console.log("error")
//        console.log(e);
//     }
// });



// var vtime = '2015-02-27T00:00';

var o = new Date();
o.setDate(o.getDate()+1);
var to = new Time(o);

// var vtime = to.format('Y'+'-'+'m'+'-'+'d')+'T00:00';

// var specialLayer = L.tileLayer.wms("http://wms1.isric.org/geoserver/soilgrids1km/wms?", {
//     layers: 'soilgrids1km:TAXGWRB',
//     format: 'image/png',
//     transparent: true,
//     CRS: 'EPSG:3857',
//     attribution: "soilgrids.org"
// }).addTo(specials);

// $(".specials-legend").append('<img src="http://wms.isric.org/geoserver/soilgrids1km/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=soilgrids1km%3ATAXGWRB">');
$(".specials-legend").html('');

// }

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

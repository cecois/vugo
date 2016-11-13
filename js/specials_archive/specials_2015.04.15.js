var specials = new L.layerGroup().addTo(map);

map.fitBounds([
    [20.96143961409684, -149.58984375],
    [62.186013857194226, -33.57421875]
]);

/* ------------- SEASONAL ---------------------------------------- */

function addSpecials(){

// $.getJSON('http://preview.weather.gov/graphical/scripts/get_multivt.php?callback=pullMaxDate', {grid: 'ndfd',elmt: 'totalsnowamt',region:'conus'}, function(json, textStatus) {
//         console.log("get date array:")
//         console.log(json)
// }
// );


var nwsurl = "http://preview.weather.gov/graphical/scripts/get_multivt.php?";
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

// var specialLayer = L.tileLayer('http://mt0.googleapis.com/mapslt?hl=en-US&lyrs=kml%3AcF5cQCE9viVeWYCAhWgQWLoGnysGYQ06gTBFYuJSDMeenFhY1ZLmFngE3YbAUKV8C0iOnQKgBkQA%7Capi%3A3%7Cclient%3A2%7Cks%3A%3Bdc%3Aqh%3Bts%3A47473208%7Ckv%3A3&x={x}&y={y}&z={z}&w=256&h=256&source=apiv3&token=112680', {foo: 'bar'}).addTo(specials);

// var vtime = '2015-02-27T00:00';

var o = new Date();
o.setDate(o.getDate()+1);
var to = new Time(o);

var vtime = to.format('Y'+'-'+'m'+'-'+'d')+'T00:00';

var specialLayer = L.tileLayer.wms("http://preview.weather.gov/graphical/wms.php", {
    layers: 'ndfd.conus.totalsnowamt,ndfd.conus.totalsnowamt.points',
    format: 'image/png',
    transparent: true,
    CRS: 'EPSG:3857',
    VT: vtime
}).addTo(specials);

$(".specials-legend").append('<img src="http://preview.weather.gov/graphical/scripts/wxmap_legendImage.php?dataset=ndfd&element=totalsnowamt&region=conus&opacity=0.8&vt='+vtime+'&left=-15174455.441884&bottom=2394263.4365179&right=-6310206.2782283&top=6483950.1367475&width=874&ms=english">');

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

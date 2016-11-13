var specials = new L.layerGroup().addTo(map);

// map.fitBounds([
//     [20.715015145512098,-129.9462890625],
//     [53.25206880589411,-62.62207031249999]
// ]);

/* ------------- SEASONAL ---------------------------------------- */


// function addSpecials(){



// var specialLayer = L.featureGroup().addTo(map);


// // var vtime = '2015-02-27T00:00';

// var o = new Date();
// o.setDate(o.getDate()+1);
// var to = new Time(o);

// var vtime = to.format('Y'+'-'+'m'+'-'+'d')+'T00:00';

// var specialLayer = L.tileLayer.wms("http://digital.weather.gov/wms.php", {
//     layers: 'ndfd.conus.maxt,ndfd.conus.maxt.points',
//     format: 'image/png',
//     transparent: true,
//     CRS: 'EPSG:3857',
//     VERSION:"1.3.0",
//     VT:vtime
// }).addTo(specials);



// $(".specials-legend").append('<img src="http://digital.weather.gov/wms.php?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ndfd.conus.maxt">');
// $(".specials-legend").html('');

// }

// we start with the special map on
// function toggleSpecial(which)
// {

// 	switch(which) {
//     case true:
// specials.addLayer(specialLayer);
// specialLayer.bringToFront()
// 	$("#btSpecial").addClass("on")

//         break;
//     case false:
// specials.removeLayer(specialLayer);
// 	$("#btSpecial").removeClass("on")
//         break;
//     default:
//         // default code block
// }

// }


// $("#btSpecial").tooltip();

// $("#btSpecial").click(function(e){
// 	e.preventDefault()

// 	if(_.toArray(specials._layers).length>0){
// 		// the thing is on, turn it offf
// 	// specials.removeLayer(specialLayer)
// 	toggleSpecial(false)
// 	} else {
// 	// specials.addLayer(specialLayer)
// toggleSpecial(true)

// 	}
// })

// toggleSpecial(true)
// } //addSpecials

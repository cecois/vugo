var specials = new L.layerGroup().addTo(map);

function addSpecials(){

// function pullStyle(feature){


// var flagIcon = L.icon({
//     iconRetinaUrl: 'images/special-marker-flag.png',
//     iconUrl: 'images/special-marker-flag.png',
//     iconSize: [18, 12],
//     iconAnchor: [10, 10],
//     popupAnchor: [3, -3],
//     // shadowUrl: 'images/special-marker-heart-shadow.png',
//     // shadowRetinaUrl: 'my-icon-shadow@2x.png',
//     // shadowSize: [20, 20],
//     // shadowAnchor: [3, 5]
// });


// var specialStyle = {

// icon: flagIcon

// }

// return specialStyle;

// }

// function onEachFeature(feature, layer) {

//       var popupContent = feature.properties.TRAILNAME;

//       if (feature.properties && feature.properties.popupContent) {
//         popupContent += feature.properties.popupContent;

//       }

//       layer.bindPopup(popupContent);
//     }

var specialLayer = L.featureGroup().addTo(map);
    // .bindPopup(
    //  function(p){
    //    console.log("p:"); console.log(p);
    //  }
    //  )// bindpopup
    // .on('click', function(t) {
    //  console.log("t:"); console.log(t);
    //  this.openPopup()
    // })


// var spurl = "http://api.geonames.org/searchJSON?q=%22mount%20vernon%22&maxRows=5&username=enormlllar";
// var spurl = 'http://api.geonames.org/searchJSON?featureCode=CMTY&country=US&operator=AND&username=enormlllar&q="national%20cemetery"';

// // appActivity.set({spin: true,message: "pulling the special from MassGIS...",caller:"special"});

// var speshl = $.getJSON( spurl, function( data ) {


// _.each(data.geonames,function(d){

// var ll = L.latLng(d.lat, d.lng);

// var pu = d.name+", "+d.adminCode1+ ' (<a href="http://www.geonames.org/'+d.geonameId+'">geonames page</a>'+")"

// // var lm = L.marker(ll).addTo(specialLayer).bindPopup(pu);
// var lm = L.marker(ll,pullStyle(d)).addTo(specialLayer).bindPopup(pu);
// // var lm = L.circleMarker(ll,pullStyle(d)).addTo(specialLayer).bindPopup(pu);

// })

// if(Backbone.history.getHash().indexOf('perdisc')<0){
// map.fitBounds(specialLayer.getBounds());}
// return data

// });

// we start with the special map on
// function toggleSpecial(which)
// {

//   switch(which) {
//     case true:
// specials.addLayer(specialLayer);
// specialLayer.bringToFront()
//   $("#btSpecial").addClass("on")
//   $("#btSpecial img").addClass("on")

//         break;
//     case false:
// specials.removeLayer(specialLayer);
//   $("#btSpecial").removeClass("on")
//   $("#btSpecial img").removeClass("on")
//         break;
//     default:
//         // default code block
// }

// }


// $("#btSpecial").tooltip();

// $("#btSpecial").click(function(e){
//   e.preventDefault()

//   if(_.toArray(specials._layers).length>0){
//     // the thing is on, turn it offf
//   // specials.removeLayer(specialLayer)
//   toggleSpecial(false)
//   } else {
//   // specials.addLayer(specialLayer)
// toggleSpecial(true)

//   }
// })

toggleSpecial(true)
} //addSpecials

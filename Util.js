var __ = require("underscore");
var TURF = require("turf");
var GJH = require("geojsonhint");


var method = Util.prototype;

function Util(age) {
	this._age = age;
}

method.escape = function(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

method.getAge = function() {
	return this._age;
};

method.is_this_geojson = function(g){
	var is=0

	var v = GJH.hint(g, {
		noDuplicateMembers: false
	});

	if(v.length > 0 && v[0].level !== 'warn'){
//bad json or not even
is=0
} else {
	// good json
	is=1
}
return is
}

method.is_this_wkt = function(g){

	// totally fake thing for now - later maybe plug wicket into it but not seeing any wkt in data.gov yet anyway
	var is=0
	return is
}

method.bbox2geojson = function(v){

	var bbox = null

	if(typeof v !== 'undefined' && v !== null){
		if(typeof v == "object"){
			bbox = TURF.bboxPolygon(v);
// array version
} else {
	bbox = TURF.bboxPolygon(v.split(" "));
// string version
}
return bbox
}
}

method.is_this_prose = function(g){

	// currently only a catcher of the "united states" metadata error
	// technically we could catch lotsa arbitrary stuff here

	var is = 0;
	if(typeof g !== 'undefined' && g !== null){
		if(g.indexOf('United States')>=0){
			is = 1
		}}

		return is

	}

	method.get_render_url_datagov = function(t,tf){

		console.log("checking url for "+tf)
		if(tf !== null || typeof tf !== 'undefined'){
			var tg = null

			var tglo = __.findWhere(t.resources,{format:tf})

			if(typeof tglo == 'undefined' || tglo==null){
				var tfu=tf.toUpperCase()
				tg = __.findWhere(t.resources,{format:tfu})
			} else {
				tg = tglo
			}

			console.log("tg after lower+upper tests:")
			console.log(tg)

			var tgc=null
			if(typeof tg !== 'undefined'){
				tgc = tg.url
				// if(typeof tg.url !== 'undefined'){tgc="sry undefined at 89"}else{tgc=tg.url;}
			}

				// var tgr = (typeof tg !== 'undefined') ? tg.url : null;
				return tgc
			} else {
					//tf wz null and shall remain so
					return null
				}
			}

			method.get_render_type_datagov = function(fmta){

				var formats_can_render=["wms","geojson","gml","json","arcgis feature service","arcgis map preview","arcgis map service","arcgis online web map, esri arcgis map service","arcgis online web map, esri arcgis server map service","arcgis server soap interface","arcrest","esri map service soap endpoint (wsdl)","esri rest","esri web mapping application","kml","kmz","wcs","wfs","xml"];
				var tfak = null
				var tfa = [];

				__.each(formats_can_render, function(fo){ 

					var fol = fo.toLowerCase()
					if(__.contains(fmta,fol) == true){
						tfa.push(fol)
					}

				});

// the first one is highest priority cuzza the way we ordered our target list
if(tfa.length>0){
	var tfak = __.first(tfa)
}

return tfak
}


method.prose_to_bbox = function(){

// static bbox of the u.s. - prolly just lifted from some reference online :-/
var usp = [-124.848974,24.396308,-66.885444,49.384358]

// make and send back a geojson poly from it
return TURF.bboxPolygon(usp)
}

method.is_this_bbox = function(g){

	var is=1

	if(typeof g !== 'undefined' && g !== null)
		{var rsa = g.split(" ")

	if(rsa.length<4){is=0}
		var w=rsa[0]
	var s=rsa[1]
	var e=rsa[2]
	var n=rsa[3]
	// if there aren't 4 coords
	if(rsa.length<4){is=0}
	// if we aren't getting w,s,e,n we die - could sit here and tryta sort it out but c'mon life is short
if(e>w || s>n){is=0}
}return is
}

method.get_publishdate_datagov = function(t){

	var E = t.extras
	var tg = __.findWhere(E,{key:"dataset-reference-date"})

	var rt = null;
	if(typeof tg !== 'undefined'){

		try {
			JSON.parse(tg.value);
			rth= JSON.parse(tg.value)[0]
		} catch (e) {
			rth= tg.value
		}
		return rth

	}

}

method.get_thumb_datagov = function(t)
{

	var E = t.extras

	var tg = __.findWhere(E,{key:"graphic-preview-file"})

	if(typeof tg !== 'undefined'){return tg.value} else {return "no thumbnail found"}


} // get_thumb*

method.get_publisher_datagov = function(t)
{

	var E = t.extras

	var tg = __.findWhere(E,{key:"publisher"})

	if(typeof tg !== 'undefined'){return tg.value} else {return "no publisher found"}


} // get_publisher*

/* sniff out [and convert] a geojson-formatted bbox from an extras block */ 
method.get_temporal_datagov = function(which,t){
	var E = t.extras

	switch(which) {
		case "begin":
		var tg = __.findWhere(E,{key:"temporal-extent-begin"})
		if(typeof tg !== 'undefined'){return tg.value}
			break;
		case "end":
		var tg = __.findWhere(E,{key:"temporal-extent-end"})
		if(typeof tg !== 'undefined'){return tg.value}
			break;
		default:
		return null
	}

} // get_temporal

/* sniff out [and convert] a geojson-formatted bbox from an extras block */ 
method.get_bbox_datagov = function(t){

	var E = t.extras

	var esp = __.findWhere(E,{key:"spatial"})

	var bwl = __.findWhere(E,{key:"bbox-west-long"});
	var bsl = __.findWhere(E,{key:"bbox-south-lat"});
	var bel = __.findWhere(E,{key:"bbox-east-long"});
	var bnl = __.findWhere(E,{key:"bbox-north-long"});

	if(typeof esp !== 'undefined'){
	// we at least have a spatial tag, let's probe it
	if(method.is_this_prose(esp.value)==1) {
		return method.prose_to_bbox()
	}
	else if(
		method.is_this_geojson(esp.value)==1){
		return esp.value
} else if(method.is_this_wkt(esp.value)==1){
		 	// convert wkt to geojsonf
		 	return method.wkt2geojson(esp.value)
		 } else if(method.is_this_bbox(esp.value)){
		 	// convert bbox to geojson
		 	return method.bbox2geojson(esp.value)
		 }
		} else if(typeof bwl !== 'undefined' && typeof bsl !== 'undefined' && typeof bel !== 'undefined' && typeof bnl !== 'undefined')
		{

			var bb = [bwl.value,bsl.value,bel.value,bnl.value];
			return method.bbox2geojson(bb)

} //if bbox-<dir>-<ll> 
else
{

	return "no spatial key or bbox-<dir>-<ll> in meta"
}


// __.each(E,function(e){
// 	if(e.key=="spatial"){
// 		// console.log(e.value)

// 	}
// });

// return "hi"
// check spatial extra key for a geojson geom
// if(E.spatial !== 'undefined'){
// console.log("E.spatial")
// console.log(E.spatial)}
// return 0
// failing that check spatial extra key for a wkt geom

// failing that check spatial extra key for a classic bbox array (w/ some lat/lng verif)

// failing that check individual keys for separated corner coords

// 


}

module.exports = Util
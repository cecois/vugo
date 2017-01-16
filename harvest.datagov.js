var __ = require("underscore");
var turf = require("turf");
var Util = require("./Util.js");
var U = new Util();

// We need this to build our post string
//var querystring = require('querystring');
var request = require('request');
//var http = require('http');
var fs = require('fs');

var jsonfile = require('jsonfile')
var file = '/tmp/js.json'
var incoming = require('./data-gov.json');
var formats_to_keep = require('./formats.json');
var globals = require('./globals.json');
var keeps = [];

var dsets = __.filter(incoming.result.results, function(r){

// a dummy for incrementing
var formats_keep=0
// if there are resources blocks
if(r.resources.length>0){
	__.each(r.resources,function(rr){
		// ...do any of their formats jibe w/ what we say we wanna keep in formats.json?
		if(__.findIndex(formats_to_keep, function(ftk){return ftk.format == rr.format})>=0){
			// oh, yes? ok we increment our counter - later we'll actually pull the format values
			formats_keep++
		}
	})
}

// if it's both a dataset and one of the formats we wanna keep, it stays
return (r.type=="dataset" && formats_keep>0);

});

/* -------------------------- frankenstein together documents from the pieces you've gathered -------------------------- */

__.each(dsets,function(t){

// if there's no id we can't use it anyway - expect this case to never be true, tho
if(typeof t.id !== 'undefined'){

	var fmtao = __.uniq(__.filter(__.pluck(t.resources,'format'),function(f){return f!=='';}));
	var fmta = __.map(fmtao,function(fo){return fo.toLowerCase()});
	var grt = U.get_render_type_datagov(fmta);

	var gru = (grt !== null)?U.get_render_url_datagov(t,grt):null;

	var keep = {
		/* -------------------------- deafult vufind fields -------------------------- */
		"_id":t.id,
		"url":globals.spatial_portal_prefix+t.id,
		"title": t.title,
		"ctrlnum":t.license_url,
		"institution":globals.institution,
		"collection":globals.collection,
		"format":fmta,
		"author":t.organization.title_full,
		"publisher":U.get_publisher_datagov(t),
		"description":t.notes,
		/* -------------------------- custom vufind fields -------------------------- */
							// "bbox": U.get_bbox_datagov(t)
							"geo_source":"data.gov",
							"bbox_west": U.get_bbox_datagov(t,"w"),
							"bbox_south": U.get_bbox_datagov(t,"s"),
							"bbox_east": U.get_bbox_datagov(t,"e"),
							"bbox_north": U.get_bbox_datagov(t,"n"),
							"temporal_begin":U.get_temporal_datagov("begin",t),
							"temporal_end":U.get_temporal_datagov("end",t),
							"publishDate":U.get_publishdate_datagov(t),
							"thumbnail":U.get_thumb_datagov(t),
							"geo_render_type":grt,
							"geo_render_url":gru,
							"ogslug":"https://catalog.data.gov/dataset/"+t.name
						}
						keeps.push(keep)}
					});


__.each(keeps,function(k){
	jsonfile.writeFile('/tmp/js-jsons/'+k._id+'.json',k,function(err){
		console.error(err)
	})
})

/* ---------------------------------------------------- 


jsonfile.writeFile(file, keeps, function (err) {
	console.error(err)
});

*/

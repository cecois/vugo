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
var file = '/tmp/harvest.carto.json'
var Config = require('./Config.json');


// replace this with call to carto
// var incoming = require('./data-gov.json');

// var formats_to_keep = require('./formats.json');
// var globals = require('./globals.json');
// var keeps = [];

/* --------------------------------------------------------- carto
// get all user tables .json
// https://cecmcgee.carto.com/api/v2/sql?q=SELECT%20CDB_UserTables(%27all%27)

// get all data library tables
// https://cecmcgee.carto.com/api/v1/viz/?tag_name=&q=fire&page=1&type=&exclude_shared=false&per_page=200&tags=&shared=yes&locked=null&only_liked=null&order=updated_at&types=table%2Cremote&deepInsights=true

// get all yo stuff
// https://cecmcgee.carto.com/api/v1/viz/?tag_name=&q=&page=1&type=&exclude_shared=false&per_page=200&tags=&shared=yes&locked=null&only_liked=null&order=updated_at&types=table%2Cremote&deepInsights=true

// get bounds of a given layer
sql.getBounds('select * from table').done(function(bounds) {
  console.log(bounds);
});

*/


var Ds=[]

if(Config.MODE!=="bus")
	{request('https://'+Config.CARTO_USER+'.carto.com/api/v1/viz/?tag_name=&q=&page=1&type=&exclude_shared=false&per_page=20&tags=&shared=yes&locked=null&only_liked=null&order=updated_at&types=table%2Cremote&deepInsights=false', function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var carto_raw = JSON.parse(body);

			// fs.writeFile('/tmp/n.carto.body.txt', body, function (err) {if (err) return console.log(err);});
			// fs.writeFile('/tmp/n.carto.jsonparse.txt', JSON.parse(body), function (err) {if (err) return console.log(err);});
			__.each(carto_raw.visualizations,function(V){


				Ds.push(U.gen_carto(V))

			})
		}
	})
} //mode check
else {

	console.log("running from static offline copy...")

	// var carto_raw = require('./carto.fake.json')
	var carto_raw = JSON.parse(fs.readFileSync('carto.fake.json', 'utf8'));
	// var carto = carto_raw;

	// fs.writeFile('/tmp/n.local.body.txt', carto_raw, function (err) {if (err) return console.log(err);});
	// fs.writeFile('/tmp/n.local.jsonparse.txt', JSON.parse(carto_raw), function (err) {if (err) return console.log(err);});
	__.each(carto_raw.visualizations,function(V){

		Ds.push(U.gen_carto(V))

	})

}

console.log("Ds:")
console.log(Ds)

/* 
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

*/

/* -------------------------- frankenstein together documents from the pieces you've gathered 

__.each(dsets,function(t){

// if there's no id we can't use it anyway - expect this case to never be true, tho
if(typeof t.id !== 'undefined'){

	var fmtao = __.uniq(__.filter(__.pluck(t.resources,'format'),function(f){return f!=='';}));
	var fmta = __.map(fmtao,function(fo){return fo.toLowerCase()});
	var grt = U.get_render_type_datagov(fmta);

	var gru = (grt !== null)?U.get_render_url_datagov(t,grt):null;
	-------------------------- */

	// var keep = {
		/* -------------------------- default vufind fields 
		-------------------------- */
		// "_id":t.id,
		// "url":globals.spatial_portal_prefix+t.id,
		// "title": t.title,
		// "ctrlnum":t.license_url,
		// "institution":globals.institution,
		// "collection":globals.collection,
		// "format":fmta,
		// "author":t.organization.title_full,
		// "publisher":U.get_publisher_datagov(t),
		// "description":t.notes,

		
		// "_id":"c0",
		// "url":globals.spatial_portal_prefix+"c0",
		// "title": "DUMMY Carto Tester",
		// "institution":globals.institution,
		// "collection":globals.collection,
		// "format":"carto poly",
		// "author":"personal",
		// "publisher":"some dude",
		// "description":"carto desc field will go here",
		/* -------------------------- custom vufind fields 
														"geo_source":"carto",
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
							-------------------------- */

						// 	"geo_source":"carto",
						// 	"bbox_west": -149.769077,
						// 	"bbox_south": -37.7572999,
						// 	"bbox_east": 144.9829127,
						// 	"bbox_north": 63.86834844,
						// 	"geo_render_type":"carto",
						// 	"geo_render_url":"https://cecmcgee.carto.com/tables/spatialtrack_poly",
						// 	"ogslug":"https://cecmcgee.carto.com/tables/spatialtrack_poly"
						// }
						// keeps.push(keep)
					// }
					// }
					// );

/* ---------------------------------------------------- 

__.each(keeps,function(k){
	jsonfile.writeFile('/tmp/js-jsons/'+k._id+'.json',k,function(err){
		console.error(err)
	})
})

*/


// jsonfile.writeFile(file, keeps, function (err) {
// 	console.error(err)
// });


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
console.log(Ds);



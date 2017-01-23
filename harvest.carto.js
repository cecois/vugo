var __ = require("underscore");
var TURF = require("turf");
var REQUEST = require('request');
var ASYNC = require('async');

var Config = require('./Config.json');
var Util = require("./Util.js");
var U = new Util();

// We need this to build our post string
//var querystring = require('querystring');
//var http = require('http');
var FS = require('fs');

var JSONFILE = require('jsonfile')
var file = '/tmp/harvest.carto.json'

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

ASYNC.waterfall([
    function(CB) {

if(Config.MODE!=="bus")
	{

	console.log("F1")
	console.log("running from live network data!")
		
		REQUEST('https://'+Config.CARTO_USER+'.carto.com/api/v1/viz/?tag_name=&q=&page=1&type=&exclude_shared=false&per_page=20&tags=&shared=yes&locked=null&only_liked=null&order=updated_at&types=table%2Cremote&deepInsights=false', function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var carto_raw = JSON.parse(body);

			// FS.writeFile('/tmp/n.carto.body.txt', body, function (err) {if (err) return console.log(err);});
			// FS.writeFile('/tmp/n.carto.jsonparse.txt', JSON.parse(body), function (err) {if (err) return console.log(err);});
			__.each(carto_raw.visualizations,function(V){

console.log("pushing this V into Ds:")
console.log(V.table.name);
				Ds.push(U.gen_carto(V))

			})
			return CB()
		}
	})
} //mode check
else {

	console.log("F2")
	console.log("running from static offline copy...")

	// var carto_raw = require('./carto.fake.json')
	var carto_raw = JSON.parse(fs.readFileSync('carto.fake.json', 'utf8'));
	// var carto = carto_raw;

	// FS.writeFile('/tmp/n.local.body.txt', carto_raw, function (err) {if (err) return console.log(err);});
	// FS.writeFile('/tmp/n.local.jsonparse.txt', JSON.parse(carto_raw), function (err) {if (err) return console.log(err);});
	__.each(carto_raw.visualizations,function(V){

		Ds.push(U.gen_carto(V))

	})

return CB(null)
}
    }, // end first waterfall
    function(CB) {
        //If we just pass in the task callback, it will automatically be called with an error, if the db.save() call fails
        // db.save('xxx', 'b', callback);
        console.log('second func')
        return CB(null)
    }
], function(err) {
    if (err) {
        //Handle the error in some way. Here we simply throw it
        //Other options: pass it on to an outer callback, log it etc.
        throw err;
    }
    console.log('Both a and b are done now');
    console.log("Ds:")
console.log(Ds);
});






// We need this to build our post string
//var querystring = require('querystring');
var request = require('request');
var http = require('http');
var fs = require('fs');
var solr = require('solr-client');

// var zdoc = require('/tmp/js-jsons/0b74a57f-6bb1-4c46-8750-cc53187468ad.json')
// var zdocs = require('/tmp/data-gov.json')

// Create a client
var client = solr.createClient('localhost', 8989, 'biblio', '/solr')

// Switch on "auto commit", by default `client.autoCommit = false`
// this currently appears to not matter at all
// client.autoCommit = true;

// var docs = [];

// Loop through all the files in the temp directory
fs.readdir( '/tmp/js-jsons/', function( err, files ) {
	if( err ) {
		console.error( "Could not list the directory.", err );
	} 

	files.forEach( function( file, index ) {

		// var source = fs.createReadStream('/tmp/js-jsons/'+file);
		var source = require('/tmp/js-jsons/'+file)
		client.add(source,function(err,obj){
			if(err){
				console.log(err);
			}else{
				console.log(obj);
			}
		});
		// console.log(source)
	} );
} );

// solr-node-client's commit and softcommit methods were failing so we just hit the native commit path
var request = require('request');
request('http://localhost:8989/solr/biblio/update?commit=true', function (error, response, body) {
	if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
}
})
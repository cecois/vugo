var ASYNC = require('async');
var REQUEST = require('request');
var __ = require("underscore");
var TURF = require("turf");
var SOLR = require('solr-client');

var Config = require('./Config.json');
var Util = require("./Util.js");
var U = new Util();

var FS = require('fs');
var JSONFILE = require('jsonfile')

/* ----------------------------------------------------------------- */

ASYNC.waterfall([
    _F1,
    _F2,
    _F3,
], function (err, result) {
/* --------------------- COMMIT TO SOLR 
    console.log("---------->RESULT:");console.log(result);
*/

var client = SOLR.createClient(Config.SOLRHOST, Config.SOLRPORT, Config.SOLRCORE, '/'+Config.SOLRPATH)
client.autoCommit = true;
__.each(result,function(R){
  client.add(R,function(err,obj){
      if(err){
        console.log(err);
      }
    });
})

REQUEST('http://'+Config.SOLRHOST+':'+Config.SOLRPORT+'/'+Config.SOLRPATH+'/'+Config.SOLRCORE+'/update?commit=true', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
}
})

});
function _F1(CB) {
  var Ds = []

if(Config.MODE!=="bus")
  {    
  console.log("mode is NOT bus");
    REQUEST('https://'+Config.CARTO_USER+'.carto.com/api/v1/viz/?tag_name=&q=&page=1&type=&exclude_shared=true&per_page=20&tags=&shared=no&locked=null&only_liked=null&order=updated_at&types=table&deepInsights=false', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var carto_raw = JSON.parse(body);
      __.each(carto_raw.visualizations,function(V){
        if(__.contains(Config.EXCLUDES,V.name)!==true){
                var d = U.gen_carto(V);
                Ds.push(d)}
      })
    return CB(null, Ds);
    }
  })
} //mode check
else {
  console.log("mode is bus");
  var carto_raw = JSON.parse(FS.readFileSync('carto.fake.json', 'utf8'));
  __.each(carto_raw.visualizations,function(V){
            if(__.contains(Config.EXCLUDES,V.name)!==true){
    Ds.push(U.gen_carto(V))
  }
  });
    return CB(null, Ds);
}

}
function _F2(Ds, CB) {
  var Es=[]

  ASYNC.each(Ds, function (D, lcb){

            var u = "https://"+Config.CARTO_USER+".carto.com/api/v2/sql?q=SELECT ST_XMin(st_extent(the_geom)) AS west,ST_YMin(st_extent(the_geom)) AS south,ST_XMax(st_extent(the_geom)) AS east,ST_YMax(st_extent(the_geom)) AS north FROM "+D.table
        var d=D
d.url=u
Es.push(d)
lcb();

    })

    return CB(null, Es);
}
function _F3(Fs, CB) {

var UA = __.pluck(Fs,'table')

var UAs = __.map(UA,function(U){
  var uasql = "SELECT '"+U+"' as table,ST_XMin(st_extent(the_geom)) AS west,ST_YMin(st_extent(the_geom)) AS south,ST_XMax(st_extent(the_geom)) AS east,ST_YMax(st_extent(the_geom)) AS north FROM "+U;
return uasql;
})

var fsql = "https://"+Config.CARTO_USER+".carto.com/api/v2/sql?q="+UAs.join(' UNION ALL ')

    
    REQUEST(fsql, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  var Ts= JSON.parse(body).rows
  var Gs=[]
__.each(Ts,function(T){
var f = __.extend(__.findWhere(Fs,{table:T.table}),{bbox_west:T.west,bbox_south:T.south,bbox_east:T.east,bbox_north:T.north});
Gs.push(f)

})

  } // code=200
return CB(null,Gs);
}) //request


}
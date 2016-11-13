var Search = Backbone.Model.extend({
	defaults: {
		qurl: "../../solr/select/?version=2.2&rows=25&defType=edismax&wt=json&q=",
		querystring: '',
		spatialSolr: '',
		page: 1,
		bbox_west: -180,
		bbox_south: -90,
		bbox_east: 180,
		bbox_north: 90,
		hash: "",
		recordsPerPage: 25,
		recordOffset: 0,
		query: ''
	},


	initialize: function() {

		// on init we want to craft a query string right away (before binding changes)
		// ...so we can bootstrap a search from incoming hash without firing off a bunch of change events

// 		map.fitBounds([
//     [this.get("bbox_south"), this.get("bbox_west")],
//     [this.get("bbox_north"), this.get("bbox_east")]
// ]);

		this.setSpatialString();
		this.recordOffset();
		this.setQuery();

// this.listenTo(this,'change:querystring', function() {
// 			this.setQuery();
// 		});

		// this.on("change:querystring", function() {
		// 	this.setQuery();
		// });
		this.on("change:querystring", this.setQuery,this);
		this.on("change:page", this.setQuery,this);
		this.on("change:page", this.recordOffset,this);

		// this.on("change:page", function() {
		// 	this.recordOffset();
		// 	this.setQuery();
		// });

		this.on("change:bbox_west change:bbox_south change:bbox_east change:bbox_north",function(){

			this.setSpatialString();
			this.setQuery();
		})

	},

	getSorters: function(){
		// most basic - score only
	var sorterString = '&sort=score desc';

	return sorterString;

	},
	getFilterQuery: function(){

// these are xy/area/difference params that feed the ranking algorithm
var xdif = Math.abs((this.get("bbox_east")-this.get("bbox_west")))
var xdifAboveWest = (xdif/2)+this.get("bbox_west")
var ydif = Math.abs((this.get("bbox_north")-this.get("bbox_south")))
var ydifAboveSouth = (ydif/2)+this.get("bbox_south")

// adjusted from OpenGeoPortal's solr fq, mostly just the minimum frange valu
		var fq = "-suppressed:true+AND+-suppressed:1&fq={!frange l=0 u=10}product(2.0,map(sum(map(sub(abs(sub("+xdifAboveWest+","+xdif+")),sum("+xdif/2+",div(sub(bbox_east,bbox_west),2))),0,400000,1,0),map(sub(abs(sub("+ydifAboveSouth+","+ydif+")),sum("+ydif/2+",div(sub(bbox_north,bbox_south),2))),0,400000,1,0)),0,0,1,0))";


		return fq;

	},
	setQuery: function() {
		var querystringRaw = this.get("querystring");
		var op = querystringRaw.indexOf("[")
		

		if(op >= 0){
			var querystring = this.get("querystring")+"+*:*";
		} else {
			var querystring = this.get("querystring");
		}

		var query = '{!lucene q.op=AND df=text}' + querystring + '~' 
		+ this.get("spatialSolr")
		 + this.getFilterQuery()
		 + "&start=" + this.get("recordOffset")+ this.getSorters()

		this.set({
			"query": query
		});

		return query
	},
	setSpatialString: function() {

		// fake area value of current map view - we'll compare it to the fake area of the record
		// we want one vector that boosts based on 
		var fakeArea = this.getEarthfactor();

// some spatial-relavance boosters adjusted from OpenGeoPortal's solr query
		var spatial = '_val_:"product(15.0,recip(sum(abs(sub(product(sub(bbox_east,bbox_west),sub(bbox_north,bbox_south)),'+fakeArea+')),.01),1,1000,1000))"';
		spatial += ' _val_:"product(3.0,recip(abs(sub(product(sum(bbox_east,bbox_west),.5),0)),1,1000,1000))"';
		spatial += ' _val_:"product(3.0,recip(abs(sub(product(sum(bbox_north,bbox_south),.5),0)),1,1000,1000))"';
		spatial += ' _val_:"product(10.0,map(sum(map(bbox_west,'+this.get("bbox_west")+','+this.get("bbox_east")+',1,0),map(bbox_east,'+this.get("bbox_west")+','+this.get("bbox_east")+',1,0),map(bbox_south,'+this.get("bbox_south")+','+this.get("bbox_north")+',1,0),map(bbox_north,'+this.get("bbox_south")+','+this.get("bbox_north")+',1,0)),4,4,1,0))"';


		this.set({
			"spatialSolr": spatial
		});
	},
	recordOffset: function() {
		var offset = (this.get("page") * this.get("recordsPerPage") - this.get("recordsPerPage"));
		this.set({recordOffset:offset});
		return offset;
	},
	getEarthfactor:function(){

		var fakeArea = ((this.get("bbox_east")-this.get("bbox_west"))*(this.get("bbox_north")-this.get("bbox_south")))

		return fakeArea

	},
getBounds:function(){

var southWest = new L.LatLng(this.get("bbox_south"), this.get("bbox_west")),
    northEast = new L.LatLng(this.get("bbox_north"), this.get("bbox_east")),
    bounds = new L.LatLngBounds(southWest, northEast);

    return bounds;

},
getBoundsAsGeoJSON:function(){

	// first array the bbox coords
	// var barr = [this.get("bbox_south"),this.get("bbox_west"),this.get("bbox_north"),this.get("bbox_east")];

	var gjob = {
    "type": "Feature",
    "properties": {
        "name": "Current Search Bounds"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
           [ [this.get("bbox_west"), this.get("bbox_north")], [this.get("bbox_west"), this.get("bbox_south")], [this.get("bbox_east"), this.get("bbox_south")],
             [this.get("bbox_east"), this.get("bbox_north")], [this.get("bbox_west"), this.get("bbox_north")] ]
           ]
    }}

    return gjob

}


});
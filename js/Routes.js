var Route = Backbone.Router.extend({
	routes: {
		// "(/:slug)(/p:page)(/:query)(/:layers)(/:downout)(/:bbox)(/)": "default"
		"(:slug)(/:page)(/:query)(/:layers)(/:downout)(/:active)(/:bbox)(/)":"default"
		// "home": "home"
	},

	default: function(slug,page,query,layers,downout,active,bbox) {


		console.log("slug:");console.log(slug);
		console.log("page:");console.log(page);
		console.log("query:");console.log(query);
		console.log("layers:");console.log(layers);
		console.log("downout:");console.log(downout);
		console.log("active:");console.log(active);
		console.log("bbox:");console.log(bbox);

		console.info("default route")


		var zslug = (typeof slug !=='undefined' && slug !== null) ? slug : "home";
		// var zactive = (typeof active !=='undefined' && active !== null) ? active : null;
		var zactive = active;

		var zpage = (typeof page !=='undefined') ? page : "1";

		// var zquery = (typeof query !=='undefined') ? query : "*";
		var zquery = ((query!==null) && (query!=="nil") && (query) && (query !== appState.get("query"))) ? query : appState.get("query");
		var zpage = ((page) && (page !== appState.get("page"))) ? page : appState.get("page");

		// var zlayers = (layers) ? layers.split(",") : ['pencil'];

		if( layers=="nil" || typeof layers == 'undefined' || layers == null){
zlayersa=mapBaseLayers.findWhere({active:true}).get("name")
zlayers=new Array(zlayersa)

		} else if(layers.indexOf(",")>-1){

			zlayers=layers.split(",")
		} else {
			zlayers=new Array(layers)
		}

		var zdownout = (typeof downout !== 'undefined' && downout!==null && downout !== 'nil') ? downout : appState.get("downout");
		// var zbbox = ((bbox) && (bbox !== appState.get("bbox"))) ? bbox : appState.get("bbox");
		var zbbox = (typeof bbox !== 'undefined' && appState.get("bbox")!==bbox && bbox!==null && bbox!=="null" && bbox!=="nil") ? bbox : appState.get("bbox");



appState.set({downout:zdownout
	// (appState.get("downout")!==zdownout) ? zdownout : appState.get("downout")
	,
	slug:
	(appState.get("slug")!==zslug) ? zslug : appState.get("slug")
	,
	active:
	(appState.get("active")!==zactive) ? zactive : appState.get("active")
	,
	bbox:
	zbbox,
	layers:_.unique(zlayers),
	query: zquery
})


appSearchView.prequery()
}

});
var appRoute = new Route();
Backbone.history.start();
var State = Backbone.Model.extend({

	defaults: {
		basemap: "cloudmade",
		tab: "search",
		querystring: "*:*"
	},
	initialize: function() {

	},
	bbox: function() {
		var bbox = map.getBounds().toBBoxString()
		return bbox
	},
	baseurl:function(){

		return document.location

	},
	basemap:function(){

var activelayer = _.find(appBaseLayers.models,function(m){return m.get("active")==true;});

return activelayer.get("name")

	},
	// tab: function() {
	// 	var activetab = $(".nav-tabs").find("li.active").find("a").attr("href");
	// 	return activetab
	// },
	querystring:function(){
		var qs = appSearch.get("querystring");
		return qs
	}
});
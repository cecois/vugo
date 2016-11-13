var BaseMap = Backbone.Model.extend({

	defaults: {
		bbox_west: -154,
		bbox_south: -9,
		bbox_east: 22,
		bbox_north: 77,
		thumburl:''
	},
initialize: function(){
return this;
},
getBounds:function(){

var southWest = new L.LatLng(this.get("bbox_south"), this.get("bbox_west"));
var northEast = new L.LatLng(this.get("bbox_north"), this.get("bbox_east"));
var bounds = new L.LatLngBounds(southWest, northEast);

    return bounds;

}
});
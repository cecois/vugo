var AdminsCollection = Backbone.Collection.extend({
	model: Admin,
	url:function(){
				return null
	},
seturl: function(ds){

this.url="http://localhost/lladmin/api/graph/graph/dev/"+ds;
return this

},

	initialize: function(options) {
            options || (options = {});
          },
          parse: function(data) {


		var $discs = data;
		console.log($discs.discs.length)
console.log("discs:"); console.log($discs.discs);
	return $discs.discs;
	} //custom parse

});
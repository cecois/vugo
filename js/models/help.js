var Help = Backbone.Model.extend({

defaults:{

},
initialize:function(){
	var fields = this.getSolrFields();

	this.set({"fields":fields});

},
getSolrFields:function(){

	// var fields = ["firstfield","secondfield"]

	var fields = (function() {
			var json = null;
			$.ajax({
				'async': false,
				'global': false,
				'type': 'GET',
				'url': solrAdmin+"luke?wt=json&reportDocCount=false&numTerms=3",
				// 'url': "../luke.json",
				'dataType': "json",
				'success': function(data) {
					json = data.fields;
				}
			});
			return json;
		})();

	return fields

}

});


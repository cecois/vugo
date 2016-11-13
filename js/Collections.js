var Active = Backbone.Collection.extend({
	defaults: {

	},
	initialize:function(options){

		options || (options = {});
		// this.listenTo(appState, 'change:active', function() {
		// 	this.fetch()
		// });

	},
		url: function() {
		if (appState.get("active") !== "nil" && appState.get("active") !== null && typeof appState.get("active")!=='undefined') {
			return "http://libgeoqa:8080/solr/select/?version=2.2&rows=1&indent=off&wt=json&json.wrf=cwmccallback&q=_id:" + appState.get("active")
		}
		return null
	},
	sync: function(method, collection, options) {
		// By setting the dataType to "jsonp", jQuery creates a function
		// and adds it as a callback parameter to the request, e.g.:
		// [url]&callback=jQuery19104472605645155031_1373700330157&q=bananarama
		// If you want another name for the callback, also specify the
		// jsonpCallback option.
		// After this function is called (by the JSONP response), the script tag
		// is removed and the parse method is called, just as it would be
		// when AJAX was used.
		options.dataType = "jsonp";
		options.jsonpCallback = 'cwmccallback';
		return Backbone.sync(method, collection, options)
	},
		parse: function(data) {

			console.log("data in parse of active:"); console.log(data);

		return data.response.docs[0]
	}
});

var Hitz = Backbone.Collection.extend({
	model: Hit,
	url: function(num) {

		var preq = appState.get("query")

		// var numbr = (typeof num !== 'undefined')?num:50;

		// var numrows = (appState.get("querytype")=="full")?num:10;

		// var q = (preq!==null && typeof preq !== 'undefined') ? preq : "*";

		// return "http://libgeoqa:8080/solr/select/?version=2.2&start=0&rows="+numrows+"&indent=off&wt=json&json.wrf=cwmccallback&q="+q
		return "http://libgeoqa:8080/solr/select/?version=2.2&rows=50&indent=off&wt=json&json.wrf=cwmccallback&q=" + quQuery.get_query()
	},
	initialize: function(options) {
		options || (options = {});
		this.listenTo(appState, 'change:query', this.prefetch);
		this.listenTo(appState, 'change:active', this.deactivate);
	},
	activate: function() {

		// _.each(this.models,function(m){
		// 	if(m.get("_id")==appState.get("active")){
		// 		m.set({active:true});
		// 	}

		// })

		var active = this.findWhere({
			_id: appState.get("active")
		})

		if (typeof active !== 'undefined') {

			active.set({
				active: true
			})


		} else {

			/*

			Wuzzis? Well, if we make it all the way to activate, but there isn't anything to activate nothing is going to happen to the collection (therefore none of its views will fire [prolly]). So we just  silently (this time) set model 0 to inactive. Is there a better way to do this? Almost certainly!

			*/

if(typeof this.models[0] !== 'undefined'){
var mz = this.models[0]
mz.trigger('change', mz);}

			// this.models[0].set({
			// 	active: false
			// })
		}

		return this

	},
	deactivate: function() {
		console.log("deactivating hitz")
		this.invoke('set', {
			"active": false
		}, {
			silent: true
		});
		return this
			.activate()
	},
	prefetch: function() {

		// appActivity.set({
		// 	message: "checking for AOIs"
		// })

		return this
			.fetch()

	},
	sync: function(method, collection, options) {
		// By setting the dataType to "jsonp", jQuery creates a function
		// and adds it as a callback parameter to the request, e.g.:
		// [url]&callback=jQuery19104472605645155031_1373700330157&q=bananarama
		// If you want another name for the callback, also specify the
		// jsonpCallback option.
		// After this function is called (by the JSONP response), the script tag
		// is removed and the parse method is called, just as it would be
		// when AJAX was used.
		options.dataType = "jsonp";
		options.jsonpCallback = 'cwmccallback';
		return Backbone.sync(method, collection, options)
	},
	parse: function(data) {

		return data.response.docs
	}

});

var BaseLayersCollection = Backbone.Collection.extend({
	model: BaseLayer,
	url: function() {
		return null
	},
	initialize: function(options) {
		options || (options = {});
	},
	activate: function(nl) {


		var nm = this.findWhere({
			name: nl
		})
		nm.set({
			active: true
		})

		return this

	},
	switch: function(nn) {


		this.invoke('set', {
			"active": false
		}, {
			silent: true
		});
		return this
			.activate(nn)
	},

});

var SwitcherCollection = Backbone.Collection.extend({
	model: SwitchLayer,
	url: function() {
		return null
	},
	initialize: function(options) {
		options || (options = {});
	}

});

var TriageCollection = Backbone.Collection.extend({
	model: Triager,
	url: function() {
		return null
	},
	initialize: function(models, options) {
		options || (options = {});
	}

});

var PanelsCollection = Backbone.Collection.extend({
	model: Panel,
	url: function() {
		return null
	},
	initialize: function(options) {
		this.listenTo(appState, 'change:slug', this.deactivate);
		options || (options = {});
	},
	activate: function() {


		_.each(this.models, function(m) {
			if (m.get("id") == appState.get("slug")) {
				m.set({
					active: true
				});
			}

		})

		return this

	},
	deactivate: function() {
		this.invoke('set', {
			"active": false
		}, {
			silent: true
		});
		return this
			.activate()
	},

});
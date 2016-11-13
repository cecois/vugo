var PerDiscView = Backbone.View.extend({

	events: {

	},
	template: Handlebars.templates['perdiscViewTpl'],
	initialize: function() {

	},

	render: function() {

		$(this.el).empty()
		$(this.el).html(this.template(this.model.toJSON()))

		var panewidth = "span10";
		var elString = "perdisc";
		var titlestring = "series "+this.model.get("activeseries");

		wakeTheKids(elString,titlestring,panewidth);

		return this.fetchAllSeries().fetchAllDiscs()
	},
	rewire: function(){

		return this

	},
	fetchAllSeries: function() {
		appActivity.set({spin: true,message: "fetching all series..."});
		var activeseries = this.model.get("activeseries")
		var series = $.getJSON("../../solr/select/?q=-series%3Aenvelopes AND -series:cib01&version=2.2&start=0&rows=500&indent=on&wt=json&sort=series+asc,handle+asc",
		// var series = $.getJSON("../api/v1/libgeo-fake.json",
		function(data) {
			var records = data.response.docs;

			var sortedrecords = _.sortBy(records,function(v){return v.series!==activeseries;})
			var items = [];

			$.each(sortedrecords, function(index, record) {
				var thisactive = (activeseries === record.series) ? true : false;

				var perDD = new PerDiscSeries({
					series: record.series,
					title: record.title,
					active: thisactive
				})

				var perDSView = new PerDiscSeriesView({
					model: perDD
				})
				$(".perdiscserieslist").append(perDSView.render().el);
			});


			appActivityView.reset()

			$('#input-perdiscfilter').fastLiveFilter('.perdiscserieslist');
		});
		return this
	},
	clearDiscsMenu:function(){

		$("#discsMenu").empty()
	},
	fetchAllDiscs: function() {
		// clear out any prior, including any FMP discs
		masterClearLayers(true);
		this.clearDiscsMenu();

		appActivity.set({spin: true,message: "fetching all disc envelopes..."});
		var activeseries = this.model.get("activeseries");
		var activedisc = this.model.get("activedisc");

		var discs = $.getJSON("../api/v1/discs/"+activeseries+"/json/individual",function(data){
			// var discs = $.getJSON("../api/v1/libgeo-fake2.json",function(data){

				if(activedisc != 'undefined'){

					addDiscsMenu(data,activedisc);
					addDiscsPolys(data,activedisc);
				} else {
					addDiscsMenu(data);
					addDiscsPolys(data);
				}
		}); //getjson func

		return this
	} //fetchAllDiscs
});
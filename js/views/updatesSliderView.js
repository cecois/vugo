var UpdatesSliderView = Backbone.View.extend({
	tagName: "div",
	className: "sliderContainer",
	// events: {"change": "render"},
	// template: Handlebars.templates['updatesSliderViewTpl'],
	initialize: function() {},
	render: function() {
		var sliderBoundmin = new Date(2012, 8, 1)
		var sliderBoundmax = new Date()
		$("#dateSlider").dateRangeSlider({
			arrows: false,
			defaultValues: {
				min: sliderBoundmin,
				max: sliderBoundmax
			},
			bounds: {
				min: sliderBoundmin,
				max: sliderBoundmax
			},
			formatter: function(val) {
				var t = new Time(val);
				return t.format('Y M d')
			}
		})
		var range = this.model.get("range")
		return this.setRangeSlider(range).rewire()
	},
	rewire: function() {
		console.log("rewiring usv")
		var $ds = this.$("#dateSlider");
		var range = this.model.get("range");

		var rangearr = splitRange(range);
		var series = this.model.get("series");
		// bind the rangeslider changing event so we can follow on the fly
		// $("#dateSlider").bind("valuesChanging", function(e, data) {
			// var tmin = new Time(data.values.min)
			// var tmax = new Time(data.values.max)
		// console.log(data.values.min)
			// appRoute.navigate("updates/" + series + "/" + data.values, {
			// 	trigger: false,
			// 	replace: true
			// });
		// });
		$("#dateSlider").bind("userValuesChanged", function(e, data) {
			var tmin = new Time(data.values.min)
			var tmax = new Time(data.values.max)
			appRoute.navigate("updates/" + series + "/" + tmin.format('Y-m-d') + ":" + tmax.format('Y-m-d'), {
				trigger: false,
				replace: false
			});
			appUpdates.set({"range":tmin.format('Y-m-d') + ":" + tmax.format('Y-m-d')})
			// appUpdatesView.render()
		});

		return this
		// .setRangeSlider(range)
	},
	setRangeSlider: function(range) {
		// first we split the incoming range
		var rangearr = splitRange(range);
		var valmin = new Date(splitDate(rangearr[0]))
		var valmax = new Date(splitDate(rangearr[1]))
		var $ds = $("#dateSlider");
		$ds.dateRangeSlider("values", valmin, valmax)
		return this
	}
});
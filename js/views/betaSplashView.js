var BetaSplashView = Backbone.View.extend({

	el: $("#beta"),
	template: Handlebars.templates['betaSplashViewTpl'],
	initialize: function() {

	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()))
		// return this.rewire()
	}

});
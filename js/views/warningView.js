var WarningView = Backbone.View.extend({

	el: $("#header"),
  template: Handlebars.templates['cookieWarningTpl'],
  initialize: function() {
    this.render();

  },

	render: function() {

    $(this.el).append(this.template(this.model.toJSON()))
    return this;

	},
  reset: function()

  {this.model.set({message:""});}

});
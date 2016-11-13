var ModalView = Backbone.View.extend({

	el: $("#modalContainer"),
  template: Handlebars.templates['modalViewTpl'],
  initialize: function() {
    this.model.bind("change", this.render, this);
    this.render();

  },

	render: function() {

    $(this.el).html(this.template(this.model.toJSON()))
    return this;

	},
  reset: function()

  {this.model.set({message:"Modal, not model."});}

});
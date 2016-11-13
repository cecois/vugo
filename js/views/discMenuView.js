var DiscMenuView = Backbone.View.extend({

  tagName:"li",
  options:{},
  template: Handlebars.templates['discMenuViewTpl'],
  events: {
    // "click .mnuThumbnail":"setBaseMap",
    // "click a":"killtt",
    // "click a":"rewire"
  },
  initialize: function() {
  },
	render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this

	}
});
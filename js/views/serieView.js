var SerieView = Backbone.View.extend({
  tagName: "li",
  options:{},
  events: {
    "change": "render"
  },
  template: Handlebars.templates['serieViewTpl'],
  initialize: function() {

  },
  render: function() {
 $(this.el).html(this.template(this.model.toJSON()));

    return this

  }
});

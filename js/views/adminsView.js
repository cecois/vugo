var AdminsView = Backbone.View.extend({
  tagName: "div",
  template: Handlebars.templates['adminsViewTpl'],
  initialize: function() {
    this.bind("change", this.render, this);
    // this.render()
  }, //init
  render: function() {
    $(this.el).empty();

    // for each requested resource, create a view and prepend it to the list.
    // this.collection.each(function(m) {

// var ad=new Admin({"model":m})
// var adv=new AdminView({"model":m})
      // $(this.el).append(adv.render().el);

      // });

    // }, this);

$(this.el).html(this.template(this.collection.toJSON()));

return this

  }

});

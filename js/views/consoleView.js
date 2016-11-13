var ConsoleView = Backbone.View.extend({
  el: $("#consoleContainer"),
  template: Handlebars.templates['consoleViewTpl'],
  initialize: function() {
    this.render();
    this.model.bind("change", this.render, this);
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()))
    return this;
  },
  reset: function() {
    this.model.set({
      message: "Hi, I'm Console reset."
    })
    return this
    .render()
  }
});
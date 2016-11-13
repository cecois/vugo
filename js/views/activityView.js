var ActivityView = Backbone.View.extend({
  el: $("#activityContainer"),
  template: Handlebars.templates['activityViewTpl'],
  initialize: function() {
    // this.model.bind("change spin", this.render, this);
    this.model.bind("change", this.render, this);
    this.model.bind("change", this.notify, this);

    // this.render();
  },
  notify:function(){

  },
  render: function() {
    // $("#activityContainer").show({"slide":100})
    $("#activityContainer").show()
    $(this.el).html(this.template(this.model.toJSON()));
    this.spin();
    return this;
  },
  reset: function() {
    $("#activityContainer").hide({"slide":100})
    this.model.set({
      spin: false,
      message: ""
    });
  },
  spin: function() {
    if (this.model.get("spin") == true) {
      $(".throb").spin("small");
    } else {
      $(".throb").spin(false);
    }
  }
});
var SubsetActivityView = Backbone.View.extend({
  // el: $(".statspane"),
  template: Handlebars.templates['subsetActivityViewTpl'],
  initialize: function() {
    // this.model.bind("change spin", this.render, this);
    this.model.bind("change", this.render, this);
    // this.model.bind("change", this.notify, this);

    // this.render();
  },
  notify:function(){

  },
  render: function() {
    // $("#activityContainer").show({"slide":100})
    // $("#activityContainer").show()
    // $(this.el).html(this.template(this.model.toJSON()));
    
    $(".statspane").html($(this.el).html(this.template(this.model.toJSON())));
    // this.spin();
    return this.spin();
  },
  reset: function() {
    // $("#activityContainer").hide({"slide":100})
    this.model.set({
      spin: false,
      message: ""
    });
  },
  spin: function() {
    if (this.model.get("spin") == true) {
      $(".statspane").find(".throb").spin("small");
    } else {
      $(this.el).find(".throb").spin(false);
    }
  }
});
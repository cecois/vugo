var PerDiscSeriesView = Backbone.View.extend({

  events: {
    "click": "changeSeries"
  },
  className: function(){
    return "perdiscseriesitem "+this.model.get("active")
    // return "active"
  },
  template: Handlebars.templates['perDiscSeriesViewTpl'],
  initialize: function() {

        Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
      if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

  },

	render: function() {

    $(this.el).html(this.template(this.model.toJSON()))
    return this;

	},
  changeSeries: function(e){

    var newseries = this.model.get("series")

          appRoute.navigate("perdisc/" + newseries, {
        trigger: true,
        replace: true
      });

  }

});
var SeriesView = Backbone.View.extend({

  tagName: "div",
  events:{},
  initialize: function() {
    // this.render()
  }, //init
  render: function() {
    $(this.el).empty();

    // for each requested resource, create a view and prepend it to the list.
    this.collection.each(function(serie) {
      console.log("serie:"); console.log(serie);
      var serieView = new SerieView({
        model: serie
      });
      $(this.el).append(serieView.render().el);

    }, this);


return this    

  }

});

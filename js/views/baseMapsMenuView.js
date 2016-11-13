var BaseMapsMenuView = Backbone.View.extend({
  tagName: "ul",
  className: "mnuThumbnails",
  activeModel: function() {
    var active = this.collection.find(function(model) {
      return model == model && model.get('active');
    });
    return active

  },
  initialize: function() {

    this.collection.bind('change:active', this.process, this);
  },

  render: function() {
    $(this.el).empty();
    this.collection.each(function(basemap) {
      var appBaseMapMenuView = new BaseMapMenuView({
        model: basemap
      });
      $(this.el).append(appBaseMapMenuView.render().el);
    }, this);
    appBaseMapView.render()
    return this
  },
  process: function(chm) {
    this.collection.unbind('change:active', this.process, this);
    this.collection.each(function(bl) {
      if (bl.cid != chm.cid) {
        bl.set({
          active: false
        })
      }
    });
    this.collection.bind('change:active', this.process, this);
    return this
      .render()
  },
  processPrevious: function(amodel) {
    //A model was toggled (on or off)
    if (amodel.get('active') == true) {
      //A model was toggled ON, so check if a different model is already selected
      var nonActive = this.collection.find(function(model) {
        return amodel !== model && model.get('active');
      });

      if (nonActive != null) {
        //Another model was selected, so toggle it to off
        nonActive.set({
          'active': false
        }, {
          silent: true
        });
      }

    }
    return this
  }
});
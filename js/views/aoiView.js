var AOIView = Backbone.View.extend({
  el: $("#inputContainer"),
  template: Handlebars.templates['aoiViewTpl'],
    events: {
    // "click .aoi-no": "destroyResponsibly"
  },
  initialize: function() {
    this.model.bind("change", this.render, this);
  },
  render: function() {
    // no matter what we wanna kill the popover from the last detection
    $("#inputContainer").popover('destroy');
    var aoihtml=this.template(this.model.toJSON());
    $(this.el).popover({
          placement: "bottom",
          content: aoihtml,
          html:true,
          trigger: "manual",
          container:'body'
        })
$(this.el).popover('show');
    return this.rewire()
  },
  rewire:function(){
    var aoistring = this.model.get("string")
    var aoitype = this.model.get("type")
    $(".aoi-yes").click(function(e){
      processAOI(aoitype,aoistring)
      $("#inputContainer").popover('destroy');
    });
    $(".aoi-no").click(function(e){
      $("#inputContainer").popover('destroy');
    });
    return this
  }
});

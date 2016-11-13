var DownloadObjectView = Backbone.View.extend({
  tagName: "li",
  options:{},
  events: {
    "change": "render"
  },
  template: Handlebars.templates['downloadObjectViewTpl'],
  initialize: function() {
    // we need all of these for some handlebar trickery, below
var handle = this.model.get("handle")
var clicked = this.model.get("clicked")
 var index = this.model.get("index")
 var url = this.model.url
    Handlebars.registerHelper('link', function(object) {
      var linkstring = handle + "-" + index;

      if(clicked == true){
        // done already, we wrap it in a completed class span
      var retstring = '<span class="completed">'+linkstring+'</span>';
      } else {
        // got a live one here
      var retstring = '<a href="'+url+'">'+linkstring+'</a>';
      }
  return new Handlebars.SafeString(
    retstring
  );
});


return this

  },
  render: function() {
 $(this.el).html(this.template(this.model.toJSON()));

    return this

  }
});

var BaseMapMenuView = Backbone.View.extend({

  tagName:"li",
  options:{},
  template: Handlebars.templates['baseMapMnu'],
  events: {
    "click .mnuThumbnail":"setBaseMap",
    "click a":"killtt",
    "click a":"rewire"
  },
  initialize: function() {

  },
  killtt:function(){
// we need to be sure we kill any active tooltips
  $(this.el).find("a").tooltip('destroy');

  },

  setBaseMap: function(e){
    e.preventDefault();
    // the clicked one becomes active 
    // (noting that the collx will post-process this to deactivate the others)
this.model.set({"active":true});
    return this
  },

	render: function() {

    this.killtt();
    $(this.el).html(this.template(this.model.toJSON()));
    return this
    .rewire()

	},

  rewire:function(){
this.$("a").tooltip({placement:'top',trigger:'hover',delay: { show: 1200, hide: 500 }});
return this

  }

});
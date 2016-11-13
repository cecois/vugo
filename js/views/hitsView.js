var HitsView = Backbone.View.extend({
  tagName: "ul",
  className: "hits",
render: function() {
    // don't forget we have layer groups that may or may not have layers rendered from previous searches. KILL THEM!
    masterClearLayers()
    // dunno - wuz seeing a ghost li sometimes
    $(this.el).empty()
    var hitscount = this.collection.length;

    if(hitscount > 0){
        // for each hit, create a view and prepend it to the list.
        this.collection.each(function(hit) {
          var hitView = new HitView({
            model: hit
          });
          $(this.el).append(hitView.render().el);
        }, this);} else {
          // no hits!
          
          $(this.el).html("<div style='text-align:center;left:-20px;position:relative;'>Your query was strange, somehow? Zero hits!</div>");
        }
        // this should be throbbing if hitsview was told to render
appActivityView.reset()
    return this.staticize()
  },
  toolize: function(){
// wire up the tooltips on these
    toolHit();
    return this
  },
  ellipsize: function() {
    $descripDiv = $(this.el).find(".description");
    // rewire the ellipsis thing
    $descripDiv.dotdotdot({
      //  configuration goes here
    });

    return this
  },
  staticize: function(){
    window.appSearchStatsView = new SearchStatsView({
  model: appSearch
});
    return this
  }
});
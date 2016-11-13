var SearchStatsView = Backbone.View.extend({

  el: $(".searchstats"),
  template: Handlebars.templates['searchStatsViewTpl'],
  initialize: function() {

    var spage = this.model.get("page");
        /* ----------
HANDLEBARS HELPERS
------------ */
    Handlebars.registerHelper('equal', function(lvalue, rvalue, options,spage) {
      
      if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    Handlebars.registerHelper('countcount', function(offset, countper, page) {
      /* councount takes the current offset and the total records per page and returns the range of records valid for the current page */
      if (arguments.length < 2) throw new Error("Handlebars Helper equal needs 2 parameters");
      var upto = countper*page;
      var floor = upto-countper+1;
      var countstring = floor+" through "+upto;
      return countstring
    });

    Handlebars.registerHelper('pageMaker', function(hits, recsperpage, options) {
    var ret = "";
    var pages = Math.round(hits/recsperpage);

    for (var i=0;i<pages;i++)
{ 
  var ind = i+1;
  if(spage == i+1){
ret += "<li><a href='#' class='strong'>"+ind+"</a></li>"
  } else {
  ret += "<li><a href='#'>"+ind+"</a></li>"}
}

    // for(var prop in context)
    // {
    //     ret = ret + options.fn({property:prop,value:context[prop]});
    // }
    return ret;
});


    this.render();
    this.model.bind("change:page", this.render, this);

  },
  render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
    return this
    .rewire()

  },
  rewire: function(){
    $(".pagination > ul > li > a").click(function(event) {
      event.preventDefault();
      var newpage = event.target.innerHTML

appSearch.set({page:newpage});
appSearchExec()


    });
    return this
  }

});
var DiscsMenuView = Backbone.View.extend({
  // tagName : "ul",
  el:"#discsMenu",
  options:{},
  events:{
    "change": "render"
  },
  // className : "mnuThumbnails",
  template: Handlebars.templates['discsMenuViewTpl'],
  initialize:function(){
    this.options.activedisc = appPerDisc.get("activedisc")
        // this one from http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
    // if you need other comparisons (>,<, etc.) return to that post
    Handlebars.registerHelper('activedisc', function(lvalue, options) {
      // if (lvalue != appPerDisc.get("activedisc")) {
        var ad = 'foo';
        if(typeof appPerDisc.get("activedisc") != 'undefined'){
          ad = appPerDisc.get("activedisc");
        }

// if(lvalue.toUpperCase() != options.activedisc.toUpperCase()){
  if(lvalue.toUpperCase() != ad.toUpperCase()){
        // if(lvalue.toUpperCase() != options.activedisc.toUpperCase()){
          return options.inverse(this);
      // }
    } else {
      return options.fn(this);
    }
  });


    this.render()

  },

  render : function() {
    // $(this.el).empty();
    tipKill()
    $(this.el).html(this.template(this.collection.toJSON()));
    $(this.el).show();

    return this
    .rewire()
  },
  rewire:function(){

    $('#input-discmenufilter').fastLiveFilter('#discsMenu');

    // $(".activedisc").tooltip({placement: 'left',trigger: 'manual',container: 'body',delay: 0,title: "this disc's extent should be visible on the map"});

    // $(".activedisc").tooltip('show');


    $(".disclist-btn-footprint").tooltip({placement: 'top',trigger: 'hover',container: 'body',delay: 0,title: "zoom to this disc's full extent"});
    $(".disclist-btn-download").tooltip({placement: 'top',trigger: 'hover',container: 'body',delay: 0,title: "download this disc"});
    $(".disclist-btn-md5").tooltip({placement: 'top',trigger: 'hover',container: 'body',delay: 0,title: "copy this disc's md5 hash to your clipboard"});

    $(".disclist-btn-md5").popover({
      container:'body',
      title:"We couldn't force this hash to your clipboard (but it's highlighted for copy/paste):",
      html:true,
      trigger:'manual',
      content:function(){
        return '<textarea id="md5-textarea" name="textarea">'+$(this).attr("data-id")+'</textarea>'
      }
    });

    $(".disclist-btn-md5").click(function(e){

      $(e).tooltip('destroy')
      e.preventDefault();

    })

    var clipboard = new Clipboard('.disclist-btn-md5', {
      text: function(trigger) {
        return $(trigger).attr("data-id")
      }
    });

    clipboard.on('success', function(e) {

      appActivity.set({message:"hash "+e.text+" was copied"})

      e.clearSelection();
    });

    clipboard.on('error', function(e) {

      $(e.trigger).popover('show')
      $('#md5-textarea').textrange('set');
    });

    return this
  }
});
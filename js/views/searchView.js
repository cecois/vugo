var SearchView = Backbone.View.extend({

  el: $("#inputContainer"),
  template: Handlebars.templates['searchViewTpl'],
  initialize: function() {

    Handlebars.registerHelper('cleanquery', function(object) {

      var cleanobj = decodeURIComponent(object)
    return new Handlebars.SafeString(cleanobj);


    });


    this.render();
    this.model.bind("change:querystring", this.render, this);
    this.model.bind("change:page", appSearchExec, this);

  },
  getTypeAheads: function() {


    var jsonv = (function() {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        'url': "https://www.googleapis.com/freebase/v1/search?spell=always&exact=false&prefixed=true&format=ac&callback=?",
        'dataType': "json",
        // query: "paris",
        'success': function(data) {
          json = data;
        }
      });
      return json;
    })();

    return jsonv;

  },

  render: function() {
    var queryCurrent = this.model.get("query");
    var queryPrev = this.model.previousAttributes().query;
    if (typeof queryCurrent != 'undefined') {
      if (queryCurrent !== queryPrev) {
        $(this.el).html(this.template(this.model.toJSON()));
      } else {
        $(this.el).html(this.template(this.model.toJSON()));
      }
    }
    /* ----------
wire up typeahead (re-wired every time this model changes, natch)
------------ */
    this.wireTypeAhead();

    /*
OBSOLETE BOOTSTRAP-ONLY VERSION
var tHeadValues = ["cib","dted"];
$('#appendedInputButtons').typeahead({source: tHeadValues, items:5});*/


    return this;

  },
  wireTypeAhead: function(){
$(function(){
    $("#appendedInputButtons").suggest({
        // filter: '(any type:/computer/file_format type:/location/)',
        filter: '(any type:/location/)',
        flyout:false,
        // css:{"list":"typeahead dropdown-menu lll-fbs-list"},
        // css:{"pane":"span4 offset2 lll-fbs-pane"},
        css: {
          "pane": "span5 offset2 lll-fbs-pane",
          "list": "lll-fbs-list"
        },
        animate: true
      }).bind("fb-select", function(e, data) {
        // meaning when someone makes a choice, we fire off the following
        fbSelect(data);

      });
});
  }

});
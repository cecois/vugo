/* ----------
a little atypical, this basically binds to a true/false model and, if true, wires
various, select DOM elements with helpful popovers that help users be more familiar with app functionality
------------ */
var HelpNagView = Backbone.View.extend({

	el: $("#helpNagWrapper"),
  events: {
    "click": "toggle"
  },
  template: Handlebars.templates['helpNag'],
  initialize: function() {
    this.model.bind("change:status", this.getStatus, this);
    this.render();

  },

  getStatus: function(){
    // is the model's status true or false? process accordingly
    var tf = this.model.get("status") == true ? this.render() : this.unwire();

  },

	render: function() {
    // ok, model is true, let's render and wire

    $(this.el).html(this.template(this.model.toJSON()));

    return this.selfHelp()
    .toolTipize()

  },
  unwire: function(){
    // model is false, re-render, but unwire
    $(this.el).html(this.template(this.model.toJSON()));
    return this.selfHelp()
    .toolTipize()
  },
  toolTipize: function(){

    var tf = this.model.get("status")
/*
here we just have an array of dom elements and the corresponding message that will appear once the helpnag option is turned on
*/
var tipArray = [
    {
        "el": "#appendedInputButtons",
        "msg": "placenames or other world features go here; pick from the list to zoom to a location",
        pos: "bottom"
    },
    {
        "el": "#appendedInputButtonsData",
        "msg": "search keywords go here; let the algorithm work for you or get fancy and consult the #help tab for advanced syntax",
        pos: "bottom"
    },
    {
"el":"#mnuBaseMap",
"msg":"Swap out the style of the basemap, choosing from several providers",
pos:"top"
    },

    {
        "el": "#header",
        "msg": "you can press the '`' (backtick - under the tilde) key to toggle almost the entire set of elements that hover over the map, including this header and navbar. The 'alt' key will also hide some elements.",
        pos: "bottom"
    },

    {
        "el": "#btnGeocode",
        "msg": "GeoCode: find/zoom to locations based on placenames (e.g. 'Seoul' or 'White Sands'",
        pos: "bottom"
    },

    {
        "el": "#btnSearch",
        "msg": "Search: search for data in our collection",
        pos: "bottom"
    },

    {
        "el": ".btnEnvelope",
        "msg": "display the entire spatial extent of the dataset",
        pos: "bottom"
    },

    {
        "el": ".btnPreview",
        "msg": "render (a lower-resolution or feature-limited) view of actual data",
        pos: "bottom"
    },

    {
        "el": ".btnCoverage",
        "msg": "display the extent of every individual tile contained in the dataset",
        pos: "bottom"
    },

    {
        "el": ".btnDetails",
        "msg": "see more specific information about this dataset",
        pos: "bottom"
    },

    {
        "el": ".btnDownload",
        "msg": "add this dataset to your queue (you can see it/adjust it using the 'Download Queue' tab, above)",
        pos: "bottom"
    },

    {
        "el": ".orderLayerMnuItem",
        "msg": "in-house, recently-ordered, and requestable layers can be toggled on/off by clicking here",
        pos: "bottom"
    },

    {
        "el": "#paneContainer",
        "msg": "an important feature here is that you can show/hide this main area with the 'alt' or 'control' keys",
        pos: "bottom"
    },

    {
        "el": ".icon-sun",
        "msg": "this means that the given layer's spatial extent explicitly intersects the spatial extent passed as a search parameter (whatever the underlying map was zoomed to at the time of search",
            pos: "bottom"
    },

    {
        "el": ".subjectlist",
        "msg": "click one or more of these tags to toggle their presence in the search field, above",
        pos: "bottom"
    },

    {
        "el": "#dateSlider",
        "msg": "The range selection can be made by dragging individual sliders or the current span area. The map will update with selections matching the criteria as soon as you stop moving the slider.",
        pos: "bottom"
    },

    {
        "el": "#dlcountbadge",
        "msg": "Download Count Badge: a dynamically-updated tally of how many downloads are in the queue (excluding those that have been removed).",
        pos: "bottom"
    },

    {
        "el": ".perdisclist",
        "msg": "A big, long list of all the data series for which we have disc-level downloads available.",
        pos: "bottom"
    },

    {
        "el": "#discsMenuContainer",
        "msg": "A list of individual discs we have on-hand for the selected series",
        pos: "top"
    }]

$.each(tipArray, function(index,tiparr) {
  var variable=(tf == true) ?
    $(tiparr.el).tooltip({
    placement: tiparr.pos,
    container:'body',
    trigger: 'hover',
    delay: 0,
    title: tiparr.msg
  })
  :
    $(tiparr.el).tooltip('destroy');
  ;

});

  },
  toggle: function(){
    // simple click-to-toggle model's on/off status
    // although either way we don't want any stray tooltips on the tooltip-izing btn
     $(".compass").tooltip('destroy');
    var attr = "status";
  var data = {}, value = this.model.get(attr);
  data[attr] = !value;
  this.model.set(data);
},
selfHelp: function(){

$(".compass").tooltip({
    placement: 'right',
    trigger: 'hover',
    delay: 0,
    title: "click to toggle 'helpful' nags"
  })
  return this
}
});
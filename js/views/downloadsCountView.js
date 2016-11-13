var DownloadsCountView = Backbone.View.extend({
el: $("#dlcountbadge"),
  tagName: "span",
  // events:{"click #downloadBrowserWarning .checkbox":"denagDownload"},
  className: "badge",
  initialize: function() {

    /* ----------
HANDLEBARS HELPER
------------ */
    // this one from http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
    // if you need other comparisons (>,<, etc.) return to that post
    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
      if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });
    this.collection.on('change', this.render, this);
    return this
    // .render()
  },

  render: function() {
    $(this.el).empty();
    // var count = appDownloads.length;
var mods = this.collection.models;
var counts = _.countBy(mods, function(mod) {
  var qd = mod.get("queued")

  return qd !== true ? 'dormant': 'queued';
});

if(counts.queued){
var count = counts.queued;} else{
  var count = 0;
}
    $(this.el).html(count);
    return this
  }

});

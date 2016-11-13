var DownloadQueueView = Backbone.View.extend({

  tagName: "div",
  className: "row",
  options:{},
  events: {
    // "change": "render",
    // "change":"debug",
    // "emptyreset": "render",
    "click .btnDLGroup .btn": "detool",
    "click .btnDLRemove": "removeDownload",
    "click .btnDLSubset": "subsetDownload",
    "click .btnEnvelope": "toggleEnvelope"
  },

  template: Handlebars.templates['downloadQueueViewTpl'],
  templateOver: Handlebars.templates['downloadQueueViewOversizeTpl'],
  initialize: function() {
    var handl = this.model.get("handle");
    var series = this.model.get("series");
    // we want this so we can pick at the metadata at will
    var meta = this.getMeta(series,handl);

    if(typeof meta != 'undefined'){

        var qud = this.model.get("queued");

        var titl = meta.title;

        var descrip = meta.description;

        var rites = meta.rights;} else{

// dummies
          var qud = true;
        var titl = "Metadata Request Failed";
        var descrip = "the data should still download properly";
        var rites = "Metadata Request Failed";

        }

    this.model.set({
      "title": titl
    }, {
      silent: true
    });
    this.model.set({
      "rights": rites
    }, {
      silent: true
    });



    /* ----------
HANDLEBARS HELPERS
------------ */

Handlebars.registerHelper('notesResolve', function(v1,v2, options) {
      if (arguments.length < 1) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (v1){
// #returnto this is not great handlebars practice
        if(v2){
        return '<div class="anno span4 muted">'+v2+'</div>'}
        else {
          return ''
        }
      } else {
        return options.inverse(this);
      }
    });

Handlebars.registerHelper('submap', function(v1, v2, options) {
      if (arguments.length < 1) throw new Error("Handlebars Helper equal needs 2 parameters");
      if (v1){
        var bboxarr = v1.split(",");
        var bboxwest=capLongitude(bboxarr[0])+5
        var bboxsouth=capLatitude(bboxarr[1])+5
        var bboxeast=capLongitude(bboxarr[2])-5
        var bboxnorth=capLatitude(bboxarr[3])-5



        return '<img class="img-thumbnail" src="http://dev.openstreetmap.org/~pafciu17/?module=map&bbox='+bboxwest+','+bboxnorth+','+bboxeast+','+bboxsouth+'&width=100&height=100" height="100px" width="100px">';
      } else {
        return options.inverse(this);
      }
    });


    Handlebars.registerHelper('sizeBeautified', function(object) {

      var valkb = object*1024;
      val = $.filesizeformat(object); // bc model's loadsize is actually in bytes

      return new Handlebars.SafeString(
      val);

    });

    Handlebars.registerHelper('pctRounded', function(object) {

      val = object.toFixed(1);
      return new Handlebars.SafeString(
      val);

    });


    Handlebars.registerHelper("each_with_index", function(array, options) {
      var total = array.length;
      var fn = options.fn;
      var buffer = "";
      for (var i = 0, j = array.length; i < j; i++) {
        var item = array[i];
        // stick an index property onto the item, starting with 1, may make configurable later
        item.index = i + 1;
        item.realindex = i;
        item.total = total;
        // show the inside of the block
        buffer += fn(item);
      }

      // return the finished buffer
      return buffer;

    });


    Handlebars.registerHelper('compare', function(lvalue, operator, rvalue, options) {

      var operators, result;

      if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
      }

      if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
      }

      operators = {
        '==': function(l, r) {
          return l == r;
        },
        '===': function(l, r) {
          return l === r;
        },
        '!=': function(l, r) {
          return l != r;
        },
        '!==': function(l, r) {
          return l !== r;
        },
        '<': function(l, r) {
          return l < r;
        },
        '>': function(l, r) {
          return l > r;
        },
        '<=': function(l, r) {
          return l <= r;
        },
        '>=': function(l, r) {
          return l >= r;
        },
        'typeof': function(l, r) {
          return typeof l == r;
        }
      };

      if (!operators[operator]) {
        throw new Error("Handlebars Helper 'compare' doesn't know the operator " + operator);
      }

      result = operators[operator](lvalue, rvalue);

      if (result) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }

    });


     this.model.bind('change', function() {
      // this.debug();
      this.render();
      // return this
    },this);

return this

  },
  toggleEnvelope: function() {
    var envelonoff = this.model.get("envelonoff");
    // toggleEnvelope is a little different here bc download models don't have envel vars by default
    // if (!envelonoff) {
    //   envelonoff = false}
    if (envelonoff == false) {
      this.renderEnvelope();
      // also put a hold on the dl queue so it doesn't wipe the envelope we just added
      appDownloadsQueueView.options.onhold = true;
    } else if (envelonoff == true) {
      this.unrenderEnvelope();
      appDownloadsQueueView.options.onhold = false;
    }
  },
  render: function() {
    /* ----------
here's why: returning from subsetting view with mouse hovering over a tooltippable el
will fire the tooltip
but then we're re-rendering, so the tooltip becomes a zombie; here we just kill 'em all first
------------ */
    this.detool()
var loadsize=this.model.get("loadsize") //remember this is in bytes, not kb, hence the bump-up
var outfiles = this.model.get("outfiles")

if(loadsize > loadLimit){ //2 GB
    $(this.el).html(this.templateOver(this.model.toJSON()));
} else{


    $(this.el).html(this.template(this.model.toJSON()));

var queued = this.model.get("queued");
if(queued == true){

if(this.model.get("outfiles")!=null){
// reference the parent el
var l = $(this.el);


     _.each(outfiles,function(of,index){
      var dlobj = new DownloadObject(of)
      // make a download object, passing the handle, sessionid, and apikey attrs it will need to act slightly independently
      dlobj.set({"index":index,"handle":this.model.get("handle")})
      var dlobjView = new DownloadObjectView({model:dlobj})
      l.find("ul.dlFileList").append(dlobjView.render().el)
    },this)

    // and just a little sugar that adjusts text size by download count
  }

    if (this.model.get("outfilescount") < 9) {
      $(this.el).find("li").css("font-size", "17px");
    } else {
      $(this.el).find("li").css("font-size", "11px");
    }
  } // if this one was even queued or not

  } //loadsize was under limit

    return this
    .rewire()

  },
submapize: function(){

// define rectangle geographical bounds
    var bbox = [[this.model.get("bbox_north"), this.model.get("bbox_west")], [this.model.get("bbox_south"), this.model.get("bbox_east")]];
    $(this.el).find(".submap").addClass("on")
    appSubMapView = new subMapView({
      el: $(this.el).find(".submap"),
      envelope: bbox
    })
    appSubMapView.render()
    return this

},
  rewire: function() {

    this.$(".btnDLGroup > .btn").tooltip({
      trigger: "hover",
      placement: "right",
      container: 'body'
    });

    return this
    .bakeProgressPie()
  },
  detool: function() {

    this.$(".btnDLGroup > .btn").tooltip('destroy');

  },
  title: function() {

    var handl = this.get("handle");
    var title = this.getMeta(handl, "title");
    this.set({
      "title": title
    }, {
      silent: true
    });

  },
  selectiveRender: function() {

/* ----------
selectiveRender is a more meticulously controlled render function. It's called by selectiveFetch (on a timer)
but note that it first checks if a hold was placed on the view.

A "hold"? Y, well in order to prevent render here (which destroys the subsetView),
we first make sure we're not supposed to be on hold.
------------ */


    var diff = this.model.changedAttributes();
    var subsetElVis = $(".dlSubset").is(":visible");
    var onhold = appDownloadsQueueView.options.onhold;
    if (onhold != true) {
      this.render()
    }


  },

  selectiveFetch: function() {


    /* ----------
selectiveFetch is called by setInterval and is designed to maintain a
connection to mongo so that the download queue can feedback to the user a given job's progress.

Note that it is an asynchronous call that in turn runs selectiveRender.
------------ */

    /* ----------
#returnto -
This is pretty wasteful, as we don't really need the entire model just to update the pctdone and outfiles values once in a while.
Need to add an endpoint that will return just the pctdone and a count of outfiles (not the sources therein)
------------ */

    var mid = this.model.get("_fakeid");
    var murl = '../api/v1/downloads/' + apikey + '/' + sessionkooky + '/' + mid;

if(appDownloadsQueueView.options.onhold == false){
    var json = (function() {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        'url': murl,
        'dataType': "json",
        'success': function(data) {
          json = data;
        }
      });
      return json;
    })();

    this.model.set({
      pctdone: json.pctdone
    }, {
      silent: true
    })
        this.model.set({
      loadsize: json.loadsize
    }, {
      silent: true
    })
    this.model.set({
      outfiles: json.outfiles
    }, {
      silent: true
    })

    this.selectiveRender()
              } //if not onhold

    return this

  },
  getMeta: function(series,handl) {
    var murl = '../api/v1/meta/' + series +'/' + handl;
    var json = (function() {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        'url': murl,
        'dataType': "json",
        'success': function(data) {
          json = data[0];
        }
      });
      return json;
    })();

    return json;

  },
  downloadCount: function() {
if(this.model.get("outfiles")){
    var dl = this.model.get("outfiles").length;}
    else {
      var dl = 0;
    }
    return dl;

  },
downloadSave:function(){
var fields = 'queued';
/*
that is, which mongo record fields do we want to update?
we're doing this manually (it's a #returnto ) bc Slim won't support a PATCH op, so the api is gonna handle this with a little brute force for a while
*/
appActivity.set({spin: true,message: "unqueuing download job..."});
    this.model.save(null,fields, {
      success: function(model, response) {
        var resp = response.status;

        if (resp == "OK") {
          // appSubsetView.model.fetch()
appActivityView.reset()
        }
      }
    }); //save
},
  removeDownload: function() {
    // first we kill any open tooltips
    this.detool()
    this.model.set({"queued":false});
this.downloadSave()
return
  },

  subsetDownload: function() {
    // first we kill any open tooltips
    this.detool()
    // then we launch a new view with the same model
    // ...by killing the extant one, if extant
    if(typeof appSubsetView !== 'undefined'){
      appSubsetView.remove()
    }
    appSubsetView = new DownloadSubsetView({
      model: this.model
    })
    // also we kinda need a hold put on this view so we can prevent errant renders upon setinterval
    appDownloadsQueueView.options.onhold = true;
    $(this.el).html(appSubsetView.render().el);

  },
  bakeProgressPie: function() {


$(this.el).find(".chart-wrapper").tooltip({
  placement: 'right',
  trigger: 'hover',
  'animation' : false,
  delay: 0,
  title:"This chart will update every "+updateInterval/1000+" seconds."

})

    $(this.el).find(".chart").empty();
    var pct = this.model.get("pctdone")


    var w = 30,
      h = 30,
      r = Math.min(w, h) / 2,
      data = [pct],
      color = d3.scale.ordinal().range(["gray", "red", "black"]);
    arc = d3.svg.arc().endAngle(function(d) {
      return 2 * Math.PI * (d / 100);
    }).outerRadius(r).innerRadius(0).startAngle(0);

    var vis = d3.select(this.el).select(".chart").append("svg:svg").attr("width", w).attr("height", h);
    var arcs = vis.selectAll("g.arc").data(data).enter().append("svg:g").attr("class", "arc").attr("transform", "translate(" + r + "," + r + ")");

    arcs.append("svg:path").attr("fill", function(d, i) {
      return color(i);
    }).attr("d", arc);

    arcs.append("text")
    .attr("text-anchor","middle")
    .attr("dy",".2em")
    .attr("dx",".1em")
    .attr("font-color","white")
    // .text(function(d){return d.toFixed(1)+"%"});
    .text(function(d){return Math.round(d)+"%"});



    return this
    // .pieTime()
  },
  renderEnvelope: function() {
        var notes = this.model.get("notes")
    if(typeof notes == 'undefined'){
      this.model.set({"notes":"don't forget you can press the alt or ` keys to toggle the visibility of the underlying map"},{silent:true})
    }

    // put a throbber in there!
    var staticIcon = enthrob($(this.el).find(".btnEnvelope > i"));

    // if this is the first init of the envelopeview
    if (typeof this.appDownloadEnvelopeLayerView == 'undefined') {

      this.appDownloadEnvelopeLayerView = new DownloadEnvelopeView({
        model: this.model
      });
    }
    // set model envelonoff to true so a hitjson will create and populate
    this.model.set({
      "envelonoff": true
    });

    // get that throbber out of there!
    dethrob($(this.el).find(".btnEnvelope > i"),staticIcon);


        var pel = $(this.el).find(".btnEnvelope")
    pel.popover({
      placement: "bottom",
      html:true,
      container: 'body',
      content: this.model.get("notes")+(" (click to remove this note)")
    }).popover('show')
    $(".popover").on("click", function() {
      pel.popover('destroy')
    });

  },
  unrenderEnvelope: function() {
    var pel = $(this.el).find(".btnEnvelope")
    pel.popover('destroy')
    var staticIcon = enthrob($(this.el).find(".btnEnvelope > i"));

    dethrob($(this.el).find(".btnEnvelope > i"),staticIcon);
    this.model.set({
      "envelonoff": false
    });
  },



});

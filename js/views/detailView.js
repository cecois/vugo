var DetailView = Backbone.View.extend({
	tagName: "div",
	options:{},
	className: "detailView span12",
	events: {
		// "change": "render",
		"click .btnEnvelope": "toggleEnvelope",
		// "click .title":"renderEnvelope",
		// "mouseleave .title":"unrenderEnvelope",
		"click .btnCoverage": "toggleCoverage",
		"click .btnPreview": "togglePreview",
		"click .btnDownload": "establishDownload",
		"click .subjectlist li": "tagStringOnOff",
		"click .btnZoomto":"zoomTo"
	},
	template: Handlebars.templates['detailViewTpl'],
	initialize: function() {
		// we're gonna sock this away locally so we can mess with queries and not lose anything
		this.options.queryOrig = appSearch.get("querystring")
		/* ----------
HANDLEBARS HELPERS
------------ */

		Handlebars.registerHelper('notesResolve', function(v1, v2, v3, v4, options) {
			if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
			if (v1 || v2 || v3){
// #returnto this is not great handlebars practice
				if(v4){
				// return '<div class="anno span4">'+v4+'</div>'}
				return '<div class="alert alert-warning span4">'+v4+'</div>'}
				else {
					return ''
				}
			} else {
				return options.inverse(this);
			}
		});

		Handlebars.registerHelper('btzoomcheck', function(v1, v2, v3, options) {
			if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
			if (v1 || v2 || v3){
				return '<a class="btn btnZoomto" ><i class="icon-zoomin"></i></a>';
			} else {
				return options.inverse(this);
			}
		});

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

		Handlebars.registerHelper('time-year-month', function(object) {
			var timeobj = new Time(object);
			var t = timeobj.format('Y' + " " + 'M');
			return new Handlebars.SafeString(t);
		});
		Handlebars.registerHelper('sanitized', function(object) {
			var cleanobj = object.replace("\r", "<br/><br/>")
			cleanobj = cleanobj.replace("\n", "<br/><br/>")
			// cleanobj = cleanobj.replace(/ +(?= )/g,'RRRRRRRR');
			cleanobj = cleanobj.replace(/\s\s\s\s+/g, '<br/><br/>')
			return new Handlebars.SafeString(cleanobj);
		});
		this.model.bind('change', this.render, this);
		return this
	},
	zoomTo: function(){

zoomToModel(this.model);

	},
	postParse: function() {
		/* ----------
A little weird, i know. It's arguable whether this is model stuff or view stuff, but it wasn't working well in the Detail model init due to the odd (?) response from Solr. Or something.
------------ */
		var series = this.model.get("series");
		var format = this.model.get("format");
		var handle = this.model.get("handle");
		switch (format) {
		case "raster":
				this.model.set({
							"envelopeUrl": "../api/v1/rasterenvelopes/" + handle + "/all/geojson/aggregate"
						});

			this.model.set({
				"coverageUrl": "../api/v1/rasterenvelopes/" + series + "/all/geojson/individual"
			});
			this.model.set({
				"thumb": "images/thumbs/" + series + "-" + handle + ".jpg"
			});
			break
		case "vector":
			var tags = this.model.get("tags");
			this.model.set({
				"envelopeUrl": "../api/v1/vectorenvelopes/" + series + "/" + handle + "/geojson"
			});
			var ppl = _.intersection(["points", "polygons", "polylines"], tags);
			this.model.set({
				"thumb": "images/thumbs/" + ppl + ".jpg"
			});
			break;
		}
		return this
	},
	render: function() {

		$(".btnEnvelope").tooltip('hide');
$(".btnCoverage").tooltip('hide');
$(".btnPreview").tooltip('hide');

		$(this.el).html(this.template(this.model.toJSON()));
		return this
		.rewire()
	},
	rewire: function(){
		var envelopeid = this.model.get("envelopeid")
		var coverageid = this.model.get("coverageid")
		var previewid = this.model.get("previewid")
		var series = this.model.get("series")
		var handle = this.model.get("handle")

// when cib01 is ready we'll have a few #returnto #cib01 hacks to clean up
if(series == "envelopes" && handle == "cib01_staging"){
var format = "raster";
} else{

		var format = this.model.get("format")
}

		$(this.el).find(".sliderenvelope").slider({value:polyOpacity,min:0,max:1,step:.1}).on('slide',function(ev){
			$.each(hitEnvelopeJson._layers, function(index, layer) {
				if (layer._leaflet_id == envelopeid) {
					layer.setStyle({"fillOpacity": ev.value});
				}
			});
		}) //slider.on

		$(this.el).find(".slidercoverage").slider({value:polyOpacity,min:0,max:1,step:.1}).on('slide',function(ev){
			$.each(rasterEnvelopes._layers, function(index, layer) {
				if (layer._leaflet_id == coverageid) {
					layer.setOpacity(ev.value)
				}
			});
		}) //slider.on

		$(this.el).find(".sliderpreview").slider({value:polyOpacity,min:0,max:1,step:.1}).on('slide',function(ev){
			$.each(hitPreviews._layers, function(index, layer) {
				if (layer._leaflet_id == previewid) {
					// previews can be vector or raster and their opacities are handled differently
					if(format == 'raster'){
										layer.setOpacity(ev.value)} else {
					layer.setStyle({"fillOpacity": ev.value});
										}
				}
			});
		}) //slider.on

// re-wire the button tooltips all at once
		toolHit()

		return this

	},
	checkForQueued: function() {
		var qdresp = $.ajax({
			'async': false,
			'global': false,
			'type': 'GET',
			'url': "../api/v1/downloads/checkfor/" + apikey + "/" + sessionkooky + "/" + this.model.get("handle"),
			'dataType': "json",
			'success': function(data) {
				return data
			}
		});
		var qd = qdresp.responseText
		return qd
	},
	establishDownload: function() {
		var state = $(this.el).find(".btnDownload").hasClass('active');
		switch (state) {
		case false:
			// a little in-button feedback
			// $(this.el).find(".btnDownload").button('loading');
			var staticIcon = enthrob($(this.el).find(".btnDownload > i"));

			var qd = this.checkForQueued();
			if (qd == "true") {
				$(this.el).find(".btnDownload").popover({
					placement: "right",
					content: "Just FYI - this series was already in your download queue.",
					trigger: "hover",
					container:'body'
				})
				$(this.el).find(".btnDownload").popover('show');
			} else {
				// here we actually do the enque and callback based on resp
				var qresp = this.hitEnQ();
				var mngoid = qresp.mongoid;
				var ssnid = qresp.sessionid;
				var handle = qresp.handle;
				if (qresp != 'some error') {
					this.model.set({
						mongosessionid: qresp.mongoid
					});
					this.model.set({
						sessionsessionid: qresp.sessionid
					});
				} else {
					this.model.set({
						mongosessionid: "null"
					})
				}
			}
			// $(this.el).find(".btnDownload").button().addClass("btn-info");
			// $(this.el).find(".btnDownload").button('complete');
			// get that throbber out of there!
			dethrob($(this.el).find(".btnDownload > i"),staticIcon);
			$(this.el).find(".btnDownload > i").addClass('active');
			break;
		case true:
			// $(this.el).find(".btnDownload").button('loading');
			// // here we actually do the enque and callback based on resp
			// var qresp = this.hitDeQ();
			// $(this.el).find(".btnDownload").button('reset');
			// $(this.el).find(".btnDownload").button().removeClass("btn-info");
			break;
		default:
			break;
		}
		tipKill()
	},
hitEnQ: function() {
		var series = this.model.get("series");
		var handle = this.model.get("handle");
		var format = this.model.get("format");

		/* ----------
also, though, we want to grab the lllgeo... cookie
so we can pass it in the url each time we add a download to the
queue -- that way all of this "user's" downloads can stay together
without having to track them for reall
------------ */
		// note default in url pattern -- that's desired export format #returnto

		var bbox = getDownloadBounds();
		// var bbox = map.getBounds().toBBoxString();

		// here's the version with hard-wired world bbox
		// var durl = "../api/v1/queue/0/" + series + "/" + handle + "/" + format + "/-180,-90,180,90/default/" + sessionkooky;

// here's the version whose download extents are matched to current map
		var durl = "../api/v1/queue/0/" + series + "/" + handle + "/" + format + "/"+bbox+"/default/" + sessionkooky;

		// has this one been added once already, then maybe dequeued?
		var mongosessionid = this.model.get("mongosessionid");
		if (typeof mongosessionid != 'undefined') {
			// ...if so, let's pass the extant mongoid and just tell it to requeue
			var jsonout = {
				"mongosessionid:": mongosessionid,
				"queued": true
			};
		} else {
			// otherwise we say nothing and let api create a new download
			var jsonout = {};
		}
		var json = (function() {
			var json = null;
			$.ajax({
				'async': false,
				'global': false,
				'data': jsonout,
				'type': 'POST',
				'url': durl,
				'dataType': "json",
				'success': function(data) {
					json = data;
				}
			});
			return json;
		})();
		checkDownloads(false,false);
		return json;
	},
	hitDeQ: function() {
		// ok so we have this mongoid associated with a hit b/c we marked it for download
		var mongosessionid = this.model.get("mongosessionid");
		// and we have the session/cookie info
		var sessionsessionid = this.model.get("sessionsessionid");
		// and since the apikey is static here in the gui, we have our de-queue url
		// notice it goes to the downloads route, since that's what we're really updating here
		var kurl = "../api/v1/queue/0/" + sessionsessionid + "/" + mongosessionid.$id + "/false";
		var json = (function() {
			var json = null;
			$.ajax({
				'async': false,
				'global': false,
				'type': 'PUT',
				'url': kurl,
				'dataType': "json",
				'success': function(data) {
					json = data;
				}
			});
			return json;
		})();
		return json;
	},
	tagStringSet: function() {
		var qo = this.options.queryOrig;
		// #returnto - we could mix in the original querystring as in
		// var tagArr = [qo];
		// or just wipe it and add only tags
		var tagArr = []
		$(this.el).find(".subjectlist ul li span.label-info").each(function() {
			var estring = '"' + $(this).text() + '"'
			tagArr.push(estring)
		})
		appSearch.set({
			querystring: tagArr.join("+")
		})
		return this;
	},
	tagStringOnOff: function(e) {
		/* ----------
Objecive here is to wire the tags to the search form - each click of a tag will either add or remove the given tag string to the search's query.

The problem? Adding is easy -- just grab the element's string and to a set on the search object.

Removing is a little hackier, as we'll have to go back into the search model and...well, we'll see what I can come up with.
------------ */
		if ($(e.target).hasClass("label-info")) {
			$(e.target).removeClass("label-info")
		} else {
			$(e.target).addClass("label-info")
		}
		return this.tagStringSet()
	},
	renderEnvelope: function() {

				var notes = this.model.get("notes")
		if(typeof notes == 'undefined'){
			this.model.set({"notes":"don't forget you can press the alt or ` keys to toggle the visibility of the underlying map"},{silent:true})
		}

		// put a throbber in there!
		var staticIcon = enthrob($(this.el).find(".btnEnvelope > i"));
		// masterClearLayers()

		// if this is the first init of the envelopeview
		if (typeof this.appHitEnvelopeLayerView == 'undefined') {

			this.appHitEnvelopeLayerView = new HitEnvelopeView({
				model: this.model
			});
		}
		// set model envelonoff to true so a hitjson will create and populate
		this.model.set({
			"envelonoff": true
		});

		// $(this.el).find(".btnEnvelope").button().addClass("btn-info");

		// get that throbber out of there!
		dethrob($(this.el).find(".btnEnvelope > i"),staticIcon);
		// $(this.el).find(".btnEnvelope > i").addClass('active');
	},
	unrenderEnvelope: function() {
		var staticIcon = enthrob($(this.el).find(".btnEnvelope > i"));

		// $(this.el).find(".btnEnvelope").button('loading');
		// $(this.el).find(".btnEnvelope").button().removeClass("btn-info");
		// $(this.el).find(".btnEnvelope").button('reset');
		// $(this.el).find(".btnEnvelope > i").removeClass('icon-throb').removeClass(throbicon).addClass('icon-expand');
		dethrob($(this.el).find(".btnEnvelope > i"),staticIcon);
		// $(this.el).find(".btnEnvelope > i").removeClass('active');
		this.model.set({
			"envelonoff": false
		});
	},
	renderCoverage: function() {
var staticIcon = enthrob($(this.el).find(".btnCoverage > i"));

		// first thing: set model on/off val to true so a hitjson view will create and populate
		if (typeof appHitCoverageLayerView == 'undefined') {
			var appHitCoverageLayerView = new HitCoverageView({
				model: this.model
			});
		}
		this.model.set({
			"covonoff": true
		});
		// var appHitCoverageLayerView = new HitCoverageView({
		// 	model: this.model
		// });
		// get that throbber out of there!
		dethrob($(this.el).find(".btnCoverage > i"),staticIcon);
		$(this.el).find(".btnCoverage > i").addClass('active');
	},
	unrenderCoverage: function() {
var staticIcon = enthrob($(this.el).find(".btnCoverage > i"));
		this.model.set({
			"covonoff": false
		});
			dethrob($(this.el).find(".btnCoverage > i"),staticIcon);
		$(this.el).find(".btnCoverage > i").removeClass('active');
	},
	renderPreview: function() {
		// $(this.el).find(".btnPreview").addClass("glowing");
		if (typeof appHitPreviewLayerView == 'undefined') {

			var appHitPreviewLayerView = new HitPreviewView({
				model: this.model
			});
		}
		this.model.set({
			prevonoff: true
		});
	},
	unrenderPreview: function() {

// $(this.el).find(".btnPreview").removeClass("glowing");
		this.model.set({
			"prevonoff": false
		});
		// a little hacky thing that forces all thumbnails glows to off
		// ...b/c as of this writing we're removing all extent geojsons collectively every time

	},
	toggleCoverage: function() {
		var covonoff = this.model.get("covonoff");

		if (covonoff == false) {
			// this seems to be the best location for this - it was failing to fire when attached to the layer.on event or even in hitCoverageView
			// var complete = this.model.get("complete");
			// complete == "1" ? console.log("complete series, nothing additional to show") : this.promptForOrder();
			appActivity.set({
				spin: true
			}, {
				silent: true
			});
			appActivity.set({
				message: "fetching preview tiles"
			});
			this.renderCoverage();
		} else if (covonoff == true) {
			this.unrenderCoverage();
		}
	},
	togglePreview: function() {
		var prevonoff = this.model.get("prevonoff");
		prevonoff == false ? this.renderPreview() : this.unrenderPreview();
	},
	toggleEnvelope: function() {
		var envelonoff = this.model.get("envelonoff");
		if (envelonoff == false) {
			this.renderEnvelope();
		} else if (envelonoff == true) {
			this.unrenderEnvelope();
		}
	},
	promptForOrder: function() {
		console.log("Must have been incomplete, as we r now in promptForORder")
		$(this.el).find(".btnCoverage").popover({
			placement: "bottom"
		}).popover('show');
	}
});
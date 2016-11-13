var HitView = Backbone.View.extend({
	tagName: "p",
	options:{},
	events: {
		// "change": "render",
		"click .btnEnvelope": "toggleEnvelope",
		// "mouseenter .title":"renderEnvelope",
		// "mouseleave .title":"unrenderEnvelope",
		// "mouseenter .title":"subMapOn",
		// "mouseleave .title":"subMapOff",
		"click .btnCoverage": "toggleCoverage",
		"click .btnDetails": "gotoDetails",
		"click .btnPreview": "togglePreview",
		"click .btnDownload": "establishDownload",
		"click .btnZoomto":"zoomTo"
	},
	template: Handlebars.templates['hitViewTpl'],
	initialize: function() {
		/* ----------
HANDLEBARS HELPER
------------ */
		Handlebars.registerHelper('notesResolve', function(v1, v2, v3, v4, options) {
			if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
			if (v1 || v2 || v3){
// #returnto this is not great handlebars practice
if(v4){
				return '<div class="anno span4">'+v4+'</div>'}
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

						Handlebars.registerHelper('vectorcheck', function(format, options) {
			if (arguments.length < 2) throw new Error("Handlebars Helper equal needs two parameters");
			console.log("format:"); console.log(format);
			console.log("covonoff:"); console.log(covonoff);
			if (format=='vector'){
				// return '<span class="alert span3">NOTE: vector previews only return '+vectorLimit+' features</span>';
				return '<span class="span4 text-warning" style="position:relative;top:5px;">NOTE: vector previews are limited to '+vectorLimit+' features</span>';
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

		this.model.bind('change', this.render, this);
		return this
	},
	render: function() {
		// var hitsIn = this.checkIntersect();
		// this.model.set({"intersects":hitsIn})
$(".btnEnvelope").tooltip('hide');
$(".btnCoverage").tooltip('hide');
$(".btnPreview").tooltip('hide');

		$(this.el).html(this.template(this.model.toJSON()));

		return this
		.rewire()
	},
	rewire:function(){
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
		zoomTo: function(){

zoomToModel(this.model);

	},
/*	ellipsize: function() {
		// some sugar for truncating the description
		$descripDiv = $(this.el).find(".description");
		// rewire the ellipsis thing
		$descripDiv.dotdotdot({
			//  configuration goes here
		});
		return this
	},*/
	checkForQueued: function() {
		var resp = $.ajax({
			'async': false,
			'global': false,
			'type': 'GET',
			'url': "../api/v1/downloads/checkfor/" + apikey + "/" + sessionkooky + "/" + this.model.get("handle"),
			beforeSend: function(){
appActivity.set({
				spin: true,
				message: "queuing layer for download..."
			});
			},
			'dataType': "json",
			'success': function(data) {
				appActivityView.reset()
				return data
			}
		});
		var qd = resp.responseText
		return qd
	},
	subMapOn: function() {
		/* ----------
This is a generous little thing (if i do say so myself) that consults the model behind this view for its bbox and drops a little leaflet instance on hover that provides a map context for the bbox. It's basically identical to the hitEnvelopeView, but is simpler and just shows up in place of btnPreview thumbnail.

There's a little waste here, yes, but it's pretty small. #returnto
------------ */
		// define rectangle geographical bounds
		var bbox = [[this.model.get("bbox_north"), this.model.get("bbox_west")], [this.model.get("bbox_south"), this.model.get("bbox_east")]];
		$(this.el).find(".btnPreview img").toggle()
		$(this.el).find(".submap").addClass("on")
		appSubMapView = new subMapView({
			el: $(this.el).find(".submap"),
			envelope: bbox
		})
		appSubMapView.render()
		return this
	},
	subMapOff: function() {
		appSubMapView = null;
		return this.render()
		// .ellipsize()
	},
	gotoDetails: function() {
		/* ----------
sharp-eyed viewers might notice this shouldn't be necessary since there's an a ref on the button itself. We want that there so ppl can preview what's about to happen (and ideally notice they can go straight to details from outside the app should they choose).

But FF and Opera at least were not respecting that href, so we'll double-wire it here, maybe.
------------ */
		var handle = this.model.get("handle");
		var series = this.model.get("series");

		resetPaneContainer("span5");

		appRoute.navigate("details/" + series + "/" + handle, {
			trigger: true
		});
	},
	establishDownload: function() {
		var state = $(this.el).find(".btnDownload").hasClass('active');
		switch (state) {
		case false:
			// a little in-button feedback
			// var staticIcon = enthrob($(this.el).find(".btnDownload > i"));
			var qd = this.checkForQueued();
			if (qd == "true") {
				$(this.el).find(".btnDownload").popover({
					placement: "bottom",
					content: "Just FYI - this series was already in your download queue.",
					trigger: "hover",
					container:'body'
				})
				$(this.el).find(".btnDownload").popover('show');
				// also write it to console
				appConsole.set({message:this.model.get("series") + " was <strong>already</strong> in your download qeueue."});
			} else {
				appActivity.set({spin: true,message: "queuing "+this.model.get("series")+":"+this.model.get("handle")});
				// here we actually do the enque and callback based on resp
				var qresp = this.hitEnQ();

				if (qresp.success == 1) {
									// it's queuedd up, so we're ood
				var mngoid = qresp.mongoid;
				var ssnid = qresp.sessionid;
				var handle = qresp.handle;
					this.model.set({
						mongosessionid: qresp.mongoid
					});
					this.model.set({
						sessionsessionid: qresp.sessionid
					});

					appConsole.set({message:this.model.get("series") + " was queueud for download using the current map extent."});

			// dethrob($(this.el).find(".btnDownload > i"),staticIcon);
			$(this.el).find(".btnDownload > i").addClass('active');
				} else {
					// ooh, that failed. Set the mongosession to null:
					this.model.set({
						mongosessionid: "null"
					});

// and report why
					$(this.el).find(".btnDownload").popover({
					placement: "left",
					content: qresp.message,
					trigger: "hover",
					container:'body'
				})
				$(this.el).find(".btnDownload").popover('show');

// oh, also reset the button
				// dethrob($(this.el).find(".btnDownload > i"),staticIcon);

				}
			}
			// $(this.el).find(".btnDownload").button().addClass("btn-info");
			// $(this.el).find(".btnDownload").button('complete');
			// 			// get that throbber out of there!
			// dethrob($(this.el).find(".btnDownload > i"),staticIcon);
			// console.log("staticon:"); console.log(staticIcon);
			// $(this.el).find(".btnDownload > i").addClass('active');
			break;
		case true:
			/* ----------
we'll wire this up later - not vital, as they can easily remove downloads from the download queue
------------ */
			// $(this.el).find(".btnDownload").button('loading');
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
		// var durl = "http://localhost/lllgeo/api/v1/queue/0/"+series+"/"+handle+"/"+format+"/-180,-90,180,90/default/"+sessionkooky;

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
					appActivityView.reset()
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
		checkDownloads(false,false);
		return json;
	},
	renderEnvelope: function() {

		var notes = this.model.get("notes")
		var handle = this.model.get("handle")

		// hey we're just gonna override the notes thing for the cib01 index
		// when cib01 is ready we'll have a few #returnto #cib01 hacks to clean up
		if(typeof notes == 'undefined' || handle == 'cib01_staging'){
			// console.log("no notes, yo")
			this.model.set({"notes":"don't forget you can press the alt or ` keys to toggle the visibility of the underlying map"},{silent:true})
		}

		var staticIcon = enthrob($(this.el).find(".btnEnvelope > i"));
		// here we say 'have we done this already? created a *view?'
		// if not we create it, so that directly below when we change the *onoff there will be something waiting to hear that and render
		if (typeof this.appHitEnvelopeLayerView == 'undefined') {

			this.appHitEnvelopeLayerView = new HitEnvelopeView({
				model: this.model
			});
		}

		// set model envelonoff to true so a hitjson will create and populate
		this.model.set({
			"envelonoff": true
		});
		// $(this.el).find(".btnEnvelope").button('loading');
		// $(this.el).find(".btnEnvelope").button().addClass("btn-info");
		// $(this.el).find(".btnEnvelope").button('complete');
				// get that throbber out of there!
		dethrob($(this.el).find(".btnEnvelope > i"),staticIcon);

	},
	unrenderEnvelope: function() {
		// $(this.el).find(".btnEnvelope").button('loading');
				var staticIcon = enthrob($(this.el).find(".btnEnvelope > i"));
		// $(this.el).find(".btnEnvelope").button().removeClass("btn-info");
		// $(this.el).find(".btnEnvelope").button('reset');
				dethrob($(this.el).find(".btnEnvelope > i"),staticIcon);
		// $(this.el).find(".btnEnvelope > i").removeClass('active');
		this.model.set({
			"envelonoff": false
		});
	},
	renderCoverage: function() {

		var staticIcon = enthrob($(this.el).find(".btnCoverage > i"));
		// here we say 'have we done this already? created a *view?'
		// if not we create it, so that directly below when we change the *onoff there will be something waiting to hear that and render
		if (typeof appHitCoverageLayerView == 'undefined') {
			var appHitCoverageLayerView = new HitCoverageView({
				model: this.model
			});
		}
		this.model.set({
			"covonoff": true
		});

				// get that throbber out of there!
		dethrob($(this.el).find(".btnCoverage > i"),staticIcon);
		// $(this.el).find(".btnCoverage > i").addClass('active');
	},
	unrenderCoverage: function() {
var staticIcon = enthrob($(this.el).find(".btnCoverage > i"));
					dethrob($(this.el).find(".btnCoverage > i"),staticIcon);
		this.model.set({
			"covonoff": false
		});
		// $(this.el).find(".btnCoverage > i").removeClass('active');
	},
	renderPreview: function() {

		// here we say 'have we done this already? created a *view?'
		// if not we create it, so that directly below when we change the *onoff there will be something waiting to hear that and render
		// $(this.el).find(".btnPreview > i").addClass('active');
		if (typeof appHitPreviewLayerView == 'undefined') {

			var appHitPreviewLayerView = new HitPreviewView({
				model: this.model
			});
		}

		this.model.set({
			"prevonoff": true
		});

	},
	unrenderPreview: function() {

		// a little hacky thing that forces all thumbnails glows to off
		// ...b/c as of this writing we're removing all extent geojsons collectively every time

		// $(this.el).find(".btnPreview > i").removeClass('active');
		this.model.set({
			"prevonoff": false
		});
		// $(".thumbnail").removeClass("glowing");
	},
	toggleCoverage: function() {
		var covonoff = this.model.get("covonoff");

		if (covonoff == false) {
			appActivity.set({
				spin: true
			}, {
				silent: true
			});
			appActivity.set({
				message: "fetching coverage tiles"
			});
			this.renderCoverage();
			// var complete = this.model.get("complete");
			// complete == "1" ? console.log("complete series, nothing additional to show") : this.promptForOrder();
			// this seems to be the best location for this - it was failing to fire when attached to the layer.on event or even in hitCoverageView
			// appActivity.set({
			// 	spin: true
			// }, {
			// 	silent: true
			// });
			// appActivity.set({
			// 	message: "fetching preview tiles"
			// });
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

		envelonoff == false ? this.renderEnvelope() : this.unrenderEnvelope();
	},
	promptForOrder: function() {

		var pel = $(this.el).find(".btnCoverage")
		pel.popover({
			placement: "bottom"
		}).popover('show')
		$(".popover-kill").on("click", function() {
			pel.popover('destroy')
		});
		// $(this.el).find(".popover").on("mouseout",function(p){p.destroy};
	},

	checkIntersect:function(){

		var hitenv = retrieveHitJson(this.model.get("envelopeUrl"));
		// first let's make sure the envelope didn't fail
		// why would it? a layer has gone missing or your'e on a dev/qa instance
		if(hitenv.success == false){
				var isect=false
				}
				else {
					var hitL = L.geoJson(hitenv)
				var isect = map.getBounds().intersects(hitL.getBounds());
			}
		return isect;

	},
});
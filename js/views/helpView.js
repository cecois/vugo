var HelpView = Backbone.View.extend({

	el: $("#help"),
	template: Handlebars.templates['helpViewTpl'],
	initialize: function() {


		var fieldDescriptions = [{
			"description": {
				"description": "Derived or hand-written abstract describing the dataset in brief. Can include project history, historic significance, possible or common applications, and some description of the dataset's contents. A search for this would look something like <code>description:\"hard copy\"~3</code>, which exemplifies a proximity query where you would be searching a potentially long description blurb for the words 'hard' and 'copy' within 3 words of each other."
			},
			"handle": {
				"description": "Second-order identifier. With 'series' field forms a kind of composite key identifying this dataset uniquely. A search for this would look like <code>handle:phys_thermalp</code>."
			},
			"_id": {
				"description": "Maybe there's a chance you would need this, but not bloody likely. Sample search: <code>_id:50f808a8880bd7a94900001d</code>."
			},
			"alphaTitleSort": {
				"description": "Sortable version of the title field. This basically takes the title field and removes everything interesting (e.g. punctuation, whitespace, etc.), resulting in something that looks like 'digitalterrainelevationdatadtedlevel.' This can be queried but will not display, as with: <code>alphaTitleSort:*utilities*</code>."
			},
			"bbox_east": {
				"description": "East-most extent of the envelope that encompasses the data. Can be queried with Solr range operators, as in <code>bbox_east:[* TO 100]</code>."
			},
			"bbox_north": {
				"description": "North-most extent of the envelope that encompasses the data. Can be queried with Solr range operators, as in <code>bbox_north:[* TO 80]</code>."
			},
			"bbox_south": {
				"description": "South-most extent of the envelope that encompasses the data. Can be queried with Solr range operators, as in <code>bbox_south:[-100 TO -50]</code>."
			},
			"bbox_west": {
				"description": "West-most extent of the envelope that encompasses the data. Can be queried with Solr range operators, as in <code>bbox_west:[* TO 100]</code>."
			},
			"classification": {
				"description": "Single-character code indicating the classified/unclassified/etc. level of the data  (e.g. 'U'), queryable as <code>classification:U</code>."
			},
			"date_end": {
				"description": "Simple date field indicating the temporal extent of the dataset. Understand that complex temporal structures for some datasets (gaps in data collection; resumption of hiatused programs, etc.) are not represented here with that level of detail. Understand also that for some data, the temporal extent in this field isn't always relevant (e.g. with elevation data that doesn't really get 'stale' except when, perhaps, a higher-resolution product eclipses its usefulness). This field is at times a best-guess as to the temporal end date of the data. Queryable as <code>date_end:[2008-12-01T23:59:59.999Z TO 2008-12-31T23:59:59.999Z]</code>, which would find all records between Dec. 1, 2008 and Dec. 31, 2008."
			},
			"date_start": {
				"description": "Simple date field indicating the temporal extent of the dataset. Understand that complex temporal structures for some datasets (gaps in data collection; resumption of hiatused programs, etc.) are not represented here with that level of detail. Understand also that for some data, the temporal extent in this field isn't always relevant (e.g. with elevation data that doesn't really get 'stale' except when, perhaps, a higher-resolution product eclipses its usefulness). This field is at times a best-guess as to the temporal start date of the data. Queryable as <code>date_start:[2010-01-01T23:59:59.999Z TO *]</code>, which would find all records between Dec. 1, 2008 and Dec. 31, 2008."
			},
			"earthfactor": {
				"description": "obsolete"
			},
			"format": {
				"description": "High-level marker of the spatial format, typically either 'vector' or 'raster' and queryable as <code>format:raster</code>."
			}
			,
			"location": {
				"description": "Code describing the collection in which the resource can be found. For the fairly distant future these will all be 'LL,' shorthand for 'Lincoln Library.' At any point, however, it might be fun to query for anything NOT 'LL' as with <code>-location:LL</code>."
			},
			"mbpersource": {
				"description": "One requirement for on-the-fly calculations of download size estimates for subset selections is to have an average size per tile sitting around. This is that value and it represents the probable size, in megabytes, of the smallest granule of a raster dataset. (Not valid for vector sources)."
			},
			"mbtotal": {
				"description": "Approximate total size, in megabytes, of the raster dataset. (Not valid for vector sources)."
			},
			"resolution": {
				"description": "Predominate spatial resolution of the dataset with Nu syntax, where N is the value and u the unit. Typically the unit is meters."
			},
			"ourweight": {
				"description": "An in-house booster we use to apply some expert ranking to various resources."
			},
			"popularity": {
				"description": "Incremental booster that largley reflects the number of times the resource has been downloaded."
			},
			"rights": {
				"description": "Warning block, usually taken verbatim from the physical discs that shipped to The Library, that delineates any potential restrictions on the use or redistribution of the data."
			},
			"series": {
				"description": "Key identifying the primary series. This is a high-level shorthand for identifying a given product, something like 'srtm01' or 'vmap01.' A query here would look like <code>series:cib01</code>."
			},
			"description_source": {
				"description": "Source for the description field."
			},
			"source": {
				"description": "In some ways an amalgamated field indicating the responsible party. Some metadata schema distinguish between publishers, distributors, and other flavors of responsible party but here the 'source' can mean any combination of these concepts."
			},
			"sources": {
				"description": "Distinctly different from the 'source' field, this is an array of all of the individual CDs, DVDs, or other media that have been processed together into their parent series and/or handles. Technically this is a searchable field (e.g. a hit for <code>sources:CB10-S00025</code> would reveal any series records that have had the disc CB10-S00025 folded into it, but that's either going to be series cib10 or nothing). It is not generally applicable, however."
			},
			"tags": {
				"description": "You know...tags. These are grab-bag terms that apply to the record and are less formal than a 'subject' term. One repeating concept represented in tags is the type of vector represented, e.g. 'polygons' or 'points.'"
			},
			"text": {
				"description": "This is a concatenated field designed for more-or-less full-record queries. In truth, as of this writing it is comprised of the title, titlealt, subject, tags, and description fields."
			},
			"title": {
				"description": "Title of the dataset, copied, derived, or constructed using -- as much as possible -- the official sources of the material."
			},
			"titlealt": {
				"description": "Hand-written (typically) alternate title for the resource. Often this field is used to guess at possible shorthand titles for the data as a means of increasing the likelihood that the search algorithm can rank its results. Searchable, though."
			},
			"updated": {
				"description": "Date field indicating the last point at which the series record was updated. Typically this will be due to the addition or update of a source disc."
			}
		}];

		Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
			if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
			if (lvalue != rvalue) {
				return options.inverse(this);
			} else {
				return options.fn(this);
			}
		});

				Handlebars.registerHelper('isString', function(lvalue, rvalue, options) {
			if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
			if (typeof lvalue != 'string') {
				return options.inverse(this);
			} else {
				return options.fn(this);
			}
		});

				Handlebars.registerHelper('joinDescription', function(lvalue, options) {
			if (arguments.length < 2) throw new Error("Handlebars Helper equal needs 2 parameters");
			var keydesc = _.pick(fieldDescriptions[0],lvalue);
			var desc = _.pluck(keydesc,'description')
			return new Handlebars.SafeString(desc);
		});

	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()))
		return this.rewire()
	},
	rewire: function() {

		/* ----------
in addition to scrollspying, we want the navbar links to still fire without triggering actual url changes/routes
so we wire up clicks on the help navbar (this is a sub navbar, mind you) so they will basically scroll "internally"
------------ */
		$('#help-nav.nav li a').click(function(event) {
			event.preventDefault();
			var t = $($(this).attr('href'))[0];
			$('.helpcontainer').scrollTo(t);
		});


		/* ----------
using jquery fastlivefilter to allow type-find access to any/all of the li elements in this pane
------------ */

        $('#input-faqfilter').fastLiveFilter('.helpcontainer');

return this
	}

});
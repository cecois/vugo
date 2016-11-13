var HomeView = Backbone.View.extend({

	el: $("#home"),
	template: Handlebars.templates['homeViewTpl'],
	initialize: function() {
		this.model.bind("change", this.render, this)
	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()))
		return this.rewire()
	},
	specialize: function(){

		$(this.el).find("#btSpecial").tooltip();

$(this.el).find("#btSpecial").click(function(e){

	e.preventDefault()

if($(e.currentTarget).hasClass("on")){
	special.setOpacity(0)
$(e.currentTarget).removeClass("on")
} else {
	$(e.currentTarget).addClass("on")
	special.setOpacity(1)
}

})

return this

	},
	rewire: function() {


		// Assign handlers immediately after making the request,
		// and remember the jqxhr object for this request
		var c3url = "../api/v1/rss/relay/c3"
		$(this.el).find("#c3latest").html('pulling latest c3 blog post...' + '<img src="images/subset-throbber.gif" height="15px" width="15px">');

		$.getJSON(c3url, {}).done(function(post) {

			if (typeof post !== 'undefined') {
				var updated = post.updated;
				var title = post.title;
				var link = post.link;

				var timeobj = new Time(updated);
				var t = timeobj.format('l' + ", " + 'F' + ' ' + 'j');

				var conc = "LATEST FROM C3: <a href='" + link + "'>" + title + "</a> <span class='anno'><em>posted " + t + "</em></span>";
				//
				$("#c3latest").html(conc);
			} else {
				$("#c3latest").html("failed to fetch latest <a href='https://c3.llan.ll.mit.edu/blogs/249650e6-9c85-498a-bd0d-59b7b602623a/?lang=en_us'>c3 blog</a> post");
			}

		});



		$(this.el).find("#homereset").popover({
			placement: "top",
			content: "Remove this error message.",
			trigger: "hover",
			container: 'body'
		});

		$("#homereset").click(function() {
			appHome.unset("homeerror");
			$(".popover").hide();
		});

		$(".contact-trigger").click(function() {

			emailContact = new Contact().set({
				message: ""
			});

			emailContactView = new ContactView({
				model: emailContact
			});

			$('#contactContainer').modal('show')

		});

return this.specialize()
	}

});
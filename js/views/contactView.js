var ContactView = Backbone.View.extend({

  el: $("#contactContainer"),
  events: {
    "click .modal-footer > .btn-primary": "submitContact",
    "click .modal-header > .close": "killMe"
  },
  killMe: function(){
    this.model.destroy();
    this.undelegateEvents();
    return this
  },
  serialize : function() {
    var timeobj = new Time();
   var t = timeobj.format('C');

   // big #returnto here -- this is a janky way to handle this and probably an upgrade of slim will allow us to use more native toJSON or other methods here
   
    var jsonout = '{"email": "'+this.$("#contactInputEmail").val()+'","badge": "'+this.$("#contactInputBadge").val()+'","requestText": "'+this.$("#contactInputMessage").val()+'","timestamp":"'+t+'","source": "webapp"}';
    return jsonout
  },
  template: Handlebars.templates['contactViewTpl'],
  initialize: function() {
    this.model.bind("change", this.render, this);
    this.render();

  },

  render: function() {

    $(this.el).html(this.template(this.model.toJSON()))
    return this;

  },
  reset: function()

  {
    this.model.set({
      message: "Hi, I'm Contact."
    });
  },
  submitContact: function() {

    var mresp = this.submitContactBody();

    if(mresp == 'success'){
    $(this.el).find(".modal-body").html('<div class="alert alert-success"><p>Thanks!</p></div>');
    // $(this.el).find(".modal-footer > .btn").html('Sent!');
    $(this.el).find(".modal-footer > .btn").hide();
    $(this.el).find(".modal-footer > .btn").removeClass('btn-primary');

    } else {
      $(this.el).find(".modal-body").html('<div class="alert alert-error"><p>Here\'s the thing: that failed for some reason.</p><p>We\'ve been notified and will fix it, but we apologize for the inconvenience.</p></div>');
    }


  },
  submitContactBody: function() {
    var durl = "../api/v1/request";

    var jsonout = this.serialize();


    var json = (function() {
      var json = null;
      $.ajax({
        'async': false,
        'global': false,
        statusCode: {
    200: function() {
      json = "success";
    }
  },
        'headers': {
          "Content-Type": 'application/json; charset=UTF-8'},
        'data': jsonout,
        'type': 'POST',
        'url': durl,
        'processData':false,
        'dataType': "json"
      });
      return json;
    })();

    return json;
  }
});
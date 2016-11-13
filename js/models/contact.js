var Contact = Backbone.Model.extend({

	initialize:function(){

console.log("initting a contact mod");

	},

defaults:{requestText:"Hi, I'm Contact."},
serialize : function() {
    var timeobj = new Time();
   var t = timeobj.format('C');

    var jsonout = '{"email": "999","badge": "999","requestText": "'+this.get("message")+'","timestamp":"'+t+'","source": "webapp"}';
    return jsonout
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
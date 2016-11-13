Handlebars.registerHelper('get_aoi_nom', function() {
        if(typeof triagePlace !== 'undefined' && typeof triagePlace.get("display_name") !=='undefined'){
                var t = "("+triagePlace.get("display_name").split(",")[0]+")"} else {
                    var t = ""
                }
        // var t = "9900"
         return new Handlebars.SafeString(t);
    });

    Handlebars.registerHelper('each_upto', function(ary, max, options) {

        console.log("this:"); console.log(this);

        if(!ary || ary.length == 0)
            return options.inverse(this);

        var result = [ ];
        for(var i = 0; i < max && i < ary.length; ++i)
            result.push(options.fn(ary[i]));
        return result.join('');
    });

    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });

    Handlebars.registerHelper('left_or_right', function() {
        var pull = null;
        hitIndex++;
        var hitIndexSide = (hitIndex % 2 == 0) ? pull = "alternate-right" : pull = "alternate-left";
        return pull;
    })
    Handlebars.registerHelper('timestamp_format', function(object) {
        var timeobj = new Time(object);
        var t = timeobj.format('l' + ", " + 'F' + ' ' + 'j');
        return new Handlebars.SafeString(t);
    });


    Handlebars.registerHelper('switcher', function(object) {

        var onoff = "on";

        var activz = map.eachLayer(function(L){
            if(map.hasLayer(L)==true){

                return L
            }
        })


        var io = _.some(activz._layers, function(a){return a._leaflet_id==object},false)


        return (io==true) ? new Handlebars.SafeString("on") : new Handlebars.SafeString("off")

        // return new Handlebars.SafeString(onoff)
    });
    Handlebars.registerHelper('nominatum_chop', function(object,i) {
        // the full nominatum strings get a little verbose
        var ob = object.split(",")
        var t = ob[i]

        return (typeof t!=='undefined' && t!==null) ? new Handlebars.SafeString(t) : new Handlebars.SafeString('');
    })

    Handlebars.registerHelper('nominatum_iconify', function(object) {

        var ico = "icon-target"

        switch (object) {
         case "relation":
         ico = "icon-poly"
         break;
         case "node":
         ico = "icon-position"
         break;
         case "way":
         ico = "icon-line-graph"
         break;
         default:
         ico=ico
     }

     return new Handlebars.SafeString(ico);
 })
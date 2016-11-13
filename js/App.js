/* ----------
bootstrapping stuff.
appSearch we create here, e.g., b/c we need it to exist always, basically,
b/c of the search bar in the header
------------ */
/* ------------- GLOBALS -------------------------------------- */
// var apphost = "libgeo"
// var apphost = "localhost"
var apphost = window.location.hostname;
var vectorLimit = "120";
window.updateInterval = 60000;
window.loadLimit = 2147483648;
window.solrRoot = "../../solr/select/?version=2.2&wt=json&q=";
window.solrAdmin = "../../solr/admin/";
window.geowebCacheRoot = "http://" + apphost + "/gs/gwc/service/wms";
// THIS SHOULD BE SET TO THE ACTUAL HOSTNAME OF THE TARGET DIST
window.geoServerHost = "http://" + apphost + "/gs/";
window.map = new L.Map('map', {
    zoomControl: false,
    center: [51.505, -0.09],
    // center: [42.53689, -71.22986],
    attributionControl: false,
    zoom: 7
});

groupHITZ = L.layerGroup().addTo(map);
// groupAOI = L.layerGroup().addTo(map);
groupAOI = L.featureGroup().addTo(map).bringToFront();
groupACTIVZ = L.layerGroup().addTo(map);
groupDLEX = L.featureGroup().addTo(map);

polyOpacity = .15;
window.pop_coordPair = $("#btnGeocode").popover({
    placement: "bottom",
    html: true,
    content: "pop_coordPair",
    trigger: "manual",
    container: 'body'
})
window.pop_wktString = $("#btnGeocode").popover({
    placement: "bottom",
    html: true,
    content: "pop_wktstring",
    trigger: "manual",
    container: 'body'
})
/* ------------- END GLOBALS ---------------------------------------- */
    // baselayers we now keep statically right here

    var baselayerz ={"layers":[{"name":"dummy","active":false,"source":"localhost","nom":"A Real Dummy","thumb":"images/thumbs/dummy.png","mapis":"dark","definition":{"maxZoom":18,"url":"images/thumbs/dummy.png","noWrap":true}},{"name":"pencil","active":false,"source":"mapbox","nom":"Aj Ashton's Pencil Map","thumb":"https://b.tiles.mapbox.com/v4/mapbox.pencil/7/37/48@2x.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbTgzcHQxMzAxMHp0eWx4bWQ1ZHN2NGcifQ.WVwjmljKYqKciEZIC3NfLA","definition":{"subdomains":["a","b","c"],"maxZoom":18,"url":"https://{s}.tiles.mapbox.com/v4/aj.03e9e12d/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbTgzcHQxMzAxMHp0eWx4bWQ1ZHN2NGcifQ.WVwjmljKYqKciEZIC3NfLA","noWrap":true}},{"name":"cloudmade","active":true,"source":"cloudmade","nom":"CloudMade Grey","thumb":"http://c.tile.cloudmade.com/4f5c5233516d4c39a218425764d98def/22677/256/3/4/2.png","definition":{"maxZoom":18,"subdomains":["a","b","c"],"noWrap":true,"url":"http://{s}.tile.cloudmade.com/4f5c5233516d4c39a218425764d98def/22677/256/{z}/{x}/{y}.png"}},{"name":"cloudmade_redalert","active":false,"source":"cloudmade","nom":"Red Alert","thumb":"http://c.tile.cloudmade.com/4f5c5233516d4c39a218425764d98def/19996/256/3/4/2.png","definition":{"maxZoom":18,"subdomains":["a","b","c"],"noWrap":true,"url":"http://{s}.tile.cloudmade.com/4f5c5233516d4c39a218425764d98def/19996/256/{z}/{x}/{y}.png"}},{"name":"opencycle_cycle","active":false,"source":"opencycle","nom":"OpenCycle","thumb":"http://a.tile.opencyclemap.org/cycle/4/8/4.png","definition":{"maxZoom":18,"subdomains":["a","b","c"],"noWrap":true,"url":"http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"}},{"name":"opencycle_landscape","active":false,"source":"opencycle","nom":"OpenCycle Landscape","thumb":"http://b.tile3.opencyclemap.org/landscape/5/17/9.png","definition":{"maxZoom":18,"subdomains":["a","b","c"],"noWrap":true,"url":"http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"}},{"name":"pinterest","active":false,"source":"pinterest","nom":"Pinterest (by Stamen)","thumb":"http://b.tiles.mapbox.com/v3/pinterest.map-ho21rkos/5/16/9.png","definition":{"maxZoom":18,"subdomains":["a","b","c"],"noWrap":true,"url":"http://{s}.tiles.mapbox.com/v3/pinterest.map-ho21rkos/{z}/{x}/{y}.png"}},{"name":"stamen_toner","active":false,"nom":"Stamen Toner","source":"stamen","thumb":"http://c.tile.stamen.com/toner/10/163/395.png","definition":{"id":"toner","url":null}},{"name":"stamen_watercolor","active":false,"nom":"Stamen Watercolor","source":"stamen","thumb":"http://tile.stamen.com/watercolor/12/655/1583.jpg","definition":{"id":"watercolor","url":null}},{"name":"mapbox_mario","active":false,"nom":"Duncan Graham's Super Mario","source":"mapbox","thumb":"https://b.tiles.mapbox.com/v4/duncangraham.552f58b0/5/20/11@2x.png?access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ","definition":{"maxZoom":18,"subdomains":["a","b","c"],"noWrap":true,"url":"http://{s}.tiles.mapbox.com/v4/duncangraham.552f58b0/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHVuY2FuZ3JhaGFtIiwiYSI6IlJJcWdFczQifQ.9HUpTV1es8IjaGAf_s64VQ"}}]};

    // var baselayerz = {"layers":[{"name":"dummy","active":true,"source":"localhost","nom":"A Real Dummy","thumb":"images/thumbs/dummy00-dummy00.jpg","mapis":"dark","definition":{"maxZoom":18,"url":"images/thumbs/dummy00-dummy00.jpg","noWrap":true}}]};
    var panelz ={"panels":[{"id":"home","displayname":"Home","active":true},{"id":"search","displayname":"Search Results"},{"id":"browse","displayname":"Browse"},{"id":"queue","displayname":"Download Queue"},{"id":"gsiab","displayname":"GSinaBOX"},{"id":"help","displayname":"Help/Docu"}]}

    window.LLGOD = new Util();


    window.appState = new State();
    window.appStateView  = new StateView({
        model:appState
    })

    appSearchView  = new SearchView({
        model:appState
    })

    mapBaseLayers = new BaseLayersCollection(baselayerz.layers);

    window.triagePlaces = new TriageCollection();
    window.triagePlace = new TriagePlace();
    window.triageCoordz = new triageCoordz();

    quQuery = new Query();

    quHz = new Hitz();

    aoiMap = new AOIMapView({model:triagePlace,id:"triage-place"})

    // quActive = new Active({})

    window.triageData = new TriageCollection();
    window.triageAOIs = new TriageCollection();

    mapDLEX = new DownloadExtent();
    mapDLEXView = new DownloadExtentView({model:mapDLEX});

// dLEXView = new DlexView({model:appState});

    mapSwitchLayers = new SwitcherCollection();
    mapSwitcherView = new SwitcherView({collection:mapSwitchLayers})

    triagePlacesView = new TriageCollectionView({collection:triagePlaces,id:"triage-places"})

    // triageDataView = new TriageCollectionView({collection:triageData,id:"triage-data"})
    triageQueryView = new TriageQueryView({collection:quHz,id:"triage-query"})

    quQueryView = new QueryView({collection:quHz,id:"search-hits"})
    quMap = new QueryMap({collection:quHz})
    // quActiveMap = new QueryActiveMap({collection:quHz})

    // quActiveView = new ActiveView({collection:quActive})

    quActiveView = new ActiveView({collection:quHz})

    triageAOIsView = new TriageCollectionView({collection:triageAOIs,id:"triage-aois"})

    window.appPanels = new PanelsCollection(panelz.panels);


    // and a menu view for stylish swappin'
    window.appBaseMapsMenuView = new BaseMapsMenuView({
        collection: mapBaseLayers
    });
    window.mapBaseMapView = new BaseMapView({
        collection: mapBaseLayers
    });
    window.appPanelMenuView = new PanelMenuView({
        collection: appPanels
    });

// window.mapLayersView = new LayersView({
//     model:map
// })
// go get em
// appBaseLayers.fetch({
//     success: function(collection) {
//         var $el = $("#mnuBaseMap");
//         $el.empty();
//         // and the prestige!
//         $el.html(appBaseMapsMenuView.render().el);
//         appBaseMapView.render();
//     }
// });
/* ------------- END SEASONAL
// layer for series envelopes
hitEnvelopeJson = L.geoJson().addTo(map);
// layer for series coverage tiles
hitCoverageJson = L.geoJson().addTo(map);
// layer for individual disc envelopes
discEnvelopeJson = new L.featureGroup().addTo(map);
// layer for incoming FMP envelopes
fmpEnvelopeJson = new L.featureGroup().addTo(map);
// layergroup for centroid labels of disc polys
markerLayer = new L.layerGroup().addTo(map);
// universal throbber icon
throbicon = "icon-spinner";
updatesJson = L.geoJson(null, {
    style: {
        "fillColor": "white"
    }
}).addTo(map);
---------------------------------------- */

// definitely this is gui, so apikey is hardwired to 0
window.APIKEY = 0;
// some of these jokers wont' be down with cookies, let's check
if (navigator.cookieEnabled) {
    cookies = true
} else {
    cookies = false;
    // new console model and view
    var cookieWarning = new Console().set({
        message: "No cookies, eh? This thing will work, but any downloads you intiate will NOT persist if you close the browser window. And you wont' be able to turn off some of the nags."
    });
    var cookieWarningView = new WarningView({
        model: cookieWarning
    });
}
// no? then we first want an id
var newDate = new Date;
var t = newDate.getTime();
var uid = APIKEY + "_" + t;
// either way we need that value for stuff
if (cookies == true) {
    // first of all, have they been here before?
    if ($.cookie('lllgeo_download_session') == null) {
        // set cookie
        $.cookie('lllgeo_download_session', uid, {
            expires: 7
        });
    }
    sessionkooky = $.cookie('lllgeo_download_session');
} else {
    sessionkooky = uid;
}
// new search model and view
// window.appSearch = new Search();
// window.appSearchView = new SearchView({
//     model: appSearch
// });
// new console model and view
// window.appConsole = new Console().set({
//     message: "HINT! Press the 'z' key at any time to reveal the full map."
// });
// window.appConsoleView = new ConsoleView({
//     model: appConsole
// });
// new activity model and view
appActivity = new Activity();
appActivityView = new ActivityView({
    model: appActivity
});
// new activity model and view
// window.appSubsetActivity = new SubsetActivity();
// window.appSubsetActivityView = new SubsetActivityView({
//     model: appSubsetActivity
// });
// do an initial check of downloads
// where inaugural=true and showdltab=false
// checkDownloads(true, false);

// window.appAOI = new AOI();
// window.appAOIView = new AOIView({
//     model: appAOI
// });

function countDiscEnvelopes() {
    /*
eh, not great to have it, but w/ empty leaflet featureGroup there seems to be no way to validate its filled presence on the map?
*/
var count = 0;
fmpEnvelopeJson.eachLayer(function(a) {
    if (a) {
        count = count + 1;
    }
});
return count;
}

function processAOI(type, str) {
    /*
    #returnto bc we do some of this in other funcs
    basically we take a user-fed string that we have already identied to be coordinats in some recognizable formats (type) and we parse it into mappable stuff
    */
    // anyway, first we'll wanna wipe everything else (maybe? #returnto ?)
    masterClearLayers();
    switch (type) {
        case "pair":
        addFromCoordinates(str, "Area of Interest from Coordinate Pair String")
        break;
        case "poly":
        addFromCoordinates(str, "Area of Interest from Coordinate Polygon String")
        break;
        case "wkt":
        addFromWKT(str, "Area of Interest from WKT String")
        break;
        default:
        console.log("shouldn't even be here")
    }
}

function getDownloadBounds(source) {
    /*
    we have a couple of ways to limit the download by spatial extent: 1 is to use the map, but in cases where we have an FMP disc envelope showing we want that instead
    */
    // let's see if there is a disc envelope
    var discenvcount = countDiscEnvelopes();
    if (discenvcount > 0) {
        // if there's a disc envelope showing, we use that
        source = "fmpdisc";
    } else if (typeof source == 'undefined') {
        // if source is undefined we need to handle it
        // ...just go back and default to map extent
        source = "map";
    }
    switch (source) {
        case "map":
        var bbox = map.getBounds().toBBoxString();
        break
        case "fmpdisc":
        var bbox = fmpEnvelopeJson.getBounds().toBBoxString();
        break
    }
    return bbox
}

function checkDownloads(inaugural, showdltab) {
    var $el = $("#paneContainer > #download");
    if (inaugural == true) {
            // we want a new downloads obj using apikey and session
            window.appDownloads = new Downloads({
                "apikey": apikey,
                "sessionid": sessionkooky
            });
            window.appDownloadsCountView = new DownloadsCountView({
                collection: appDownloads
            });
            window.appDownloadsQueueView = new DownloadsQueueView({
                collection: appDownloads
            });
            appDownloadsQueueView.options.onhold == false;
        }
        var onhold = appDownloadsQueueView.options.onhold;
        if (onhold != true) {
            // there might be one or many envelopes showing, so we kill, kill, kill:
            appConsole.set({
                message: "getting downloads state from server..."
            })
            masterClearLayers();
            appDownloads.fetch({
                success: function(collection) {
                    // appConsoleView.reset()
                    appDownloadsCountView.render();
                    if (collection.length > 0) {
                        // and the prestige!
                        if (showdltab == true) {
                            $el.empty();
                            $el.html(appDownloadsQueueView.render().el);
                        }
                    } else $el.html("<div class='row' style='padding-top:50px;'><div class='alert alert-error span6 offset4'>None! Sorry, but there just aren't any.</div></div>")
                },
                error: function(response) {
                    $el.html("<div class='row' style='padding-top:50px;'><div class='alert alert-error span6 offset4'>Well...uh...this is embarrassing, but this thing has broken at the knees and cannot return results right now.</div></div>")
                }
            });
        } // is onhold true?
        appConsoleView.reset()
    }
    // oh, about that activity console...
    // let's just presume that any time we kill a layer we'll also reset the activity console
    // map.on('layerremove', function(e) {
    //     appActivityView.reset();
    //     appConsoleView.reset();
    // });
    map.on('layeradd', function(e) {
    // appActivityView.reset();
});
//all purpose modal and view
// window.appModal = new Modal();
// window.appModalView = new ModalView({
//     model: appModal
// });
//all purpose help model and view
// window.appHelpNag = new HelpNag();
// window.appHelpNagView = new HelpNagView({
//     model: appHelpNag
// });
//home page! a Backbone model, too? Yes!
appHome = new Home({});
appHomeView = new HomeView({
    model: appHome
}).render();
//help page! a Backbone model, too? Yes!
// appHelp = new Help({});
// appHelpView = new HelpView({
//     model: appHelp
// }).render();
//beta page! a Backbone model, too? Yes!
// appBetaSplash = new BetaSplash({});
//     appBetaSplashView = new BetaSplashView({
//       model: appBetaSplash
//     }).render();
// catch-all group for user-drawns, which as of this writing are for subsetting only
drawnItems = new L.LayerGroup();
// first we have to bind to map events

// map.on('moveend', function(e) {
//     setAppSearchBoundsFromMap();
//     // it feels like also we should notify the user that since the map moved their next search will be affected
//     // if this gets annoying we'll kill it
//     appConsole.set({
//         message: "the map has moved -- your next search will factor in the new extent"
//     })
// });
// map.on('layerremove', function(e) {
// some layers will report info to console, here's a universal reset for those
// appConsoleView.reset();
// });
function zoomToModel(m) {
    var bounds = [
    [m.get("bbox_north"), m.get("bbox_west")],
    [m.get("bbox_south"), m.get("bbox_east")]
    ];
    map.fitBounds(bounds);
}

function setAppSearchBoundsFromMap() {
    var boundsArr = map.getBounds();
    var sw = boundsArr.getSouthWest();
    var ne = boundsArr.getNorthEast();
    // a little nudging to account for calculated extents that go beyond abs(180),abs(90)
    var w = capLongitude(sw.lng) - 1;
    var s = capLatitude(sw.lat) - 1;
    var e = capLongitude(ne.lng) + 1;
    var n = capLatitude(ne.lat) + 1;
    appSearch.set({
        bbox_west: w,
        bbox_south: s,
        bbox_east: e,
        bbox_north: n
    });
}

function capLatitude(lat) {
    if (lat > 90) {
        lat = 90;
    } else if (lat < -90) {
        lat = -90;
    }
    return lat;
}

function capLongitude(lng) {
    if (lng > 180) {
        lng = 180;
    } else if (lng < -180) {
        lng = -180;
    }
    return lng;
}

function fireSearch() {
    // $("#appendedInputButtonsData").blur(); //mostly so z keypress will work instantly and not append 'z' to end of querystring
    // this was the single-field version
    // var queryInput = $("#inputSearch input");
    // but we split it apart
    var queryInput = $("#appendedInputButtonsData");
    if (queryInput.val() == '') {
        queryInput.val("*:*")
    }
    // first we send the query string to the appSearch model
    appSearch.set({
        "querystring": queryInput.val()
    }
        // , {
        // 	silent: true
        // }
        );
    appSearch.set({
        "page": 1
    }); //bc we're firing off a new query and page may be set already
    // and fire off appSearchExec
    // ...which will pick up that query string from the model and fire it off
    appSearchExec();
}
$(function() {
    /* ----------
wire up the search button
------------ */
$("#inputSearch input").keyup(function(e) {
    if (e.keyCode == 13) {
        fireSearch()
    }
});
$("#btnSearch").click(function() {
    fireSearch()
});
});

function appSearchExec() {
        // we might have a joke layer that we'll remove bc ppl are prolly trying to get some work done
        // if(typeof specials !== 'undefined'){toggleSpecial(false);}
        /* ----------
SOME PRELIMS
------------ */
var hitwidth = "span5";
        // first we clear some screen real estate
        $("#paneContainer").addClass(hitwidth);
        var $el = $("#paneContainer > #search > #searchhitsWrapper > #searchhits");
        appActivity.set({
            spin: true,
            message: "searching...",
            caller: "search"
        });
        // ActivityManager("searching...","search");
        // we want a new hits obj using current appSearch model's query
        var qurl = appSearch.get("qurl")
        var query = appSearch.get("query");
        var queryHuman = appSearch.get("querystring");
        var page = appSearch.get("page");
        appHits = null;
        $.ajax({
            url: qurl + query,
            type: 'GET',
            dataType: 'json',
            beforeSend: function() {
                wakeTheKids('search', queryHuman, hitwidth);
            },
            complete: function(xhr, textStatus) {
                // appActivityView.reset();
            },
            success: function(data, textStatus, xhr) {
                appHits = new Hits(data.response.docs)
                var hitCount = data.response.numFound
                appSearch.set({
                    hitcount: hitCount
                })
                appHitsView = new HitsView({
                    collection: appHits
                });
                // and the prestige!
                $el.html(appHitsView.render().el);
                // and now that it's all rendered, some sugar...
                appHitsView.toolize();
            },
            error: function(xhr, textStatus, errorThrown) {
                $el.html('<div class="alert alert-error span4">Hm, this thing has broken at the knees and cannot return results right now. Sad face.</div>')
            }
        });
        // well, almost - if we weren't already on the search "page" we need to go there
        appRoute.navigate("search/p" + page + "/" + queryHuman, {
            // trigger: true,
            replace: true
        });
        // not doing this anymore, too slow
        // appConsole.set({"message":'<i style="font-size:1em;color:green;" class="icon-sun"></i> = layer\'s extent overlaps map extent.'});
        // appConsole.set({"message":"Hello, I'm Console."});
        // appConsoleView.render()
        // wakeTheKids('search', queryHuman);
        // rewire the search button
        $("#btnSearch").click(function() {
            fireSearch()
        });
        mapMatchSearch();
    }
    /* ----------
    This is a handlebars helper that may not be used #returnto
    was gonna help alternate li element styles/positioning
    but Bootstrap paints them to the grid, which seems to take care of it
    ------------ */
    var hitIndex = 0;



    function tipKill() {
    // always we wanna kill straggling tooltips and popovers
    $('.tooltip').hide();
    $('.popover').hide();
}

function masterClearLayers(incdisc) {
    var includeDisc = incdisc; // that is, do we also wanna clear the FMP disc group?
    // console.log("masterclear")
    /* ----------
This is tricky. We need a capable assassin for when we need to clear the map and show something new. But there are *some* layers that can co-exist
------------ */
    // if(typeof markerLayer != 'undefined'){
    // map.removeLayer(markerLayer);
    markerLayer.eachLayer(function(layer) {
        layer.hideLabel()
        layer.unbindLabel()
    });
    // }
    if (typeof drawnItems != 'undefined') {
        map.removeLayer(drawnItems);
    }
    // if(typeof geojsonZoom != 'undefined'){geojsonZoom.clearLayers()}
    if (typeof geoFromWKT != 'undefined') {
        geoFromWKT.clearLayers()
    }
    if (typeof hitPreviews != 'undefined') {
        hitPreviews.clearLayers();
    }
    if (typeof rasterEnvelopes != 'undefined') {
        rasterEnvelopes.clearLayers();
    }
    if (typeof hitEnvelopeJson != 'undefined') {
        hitEnvelopeJson.clearLayers();
    }
    if (typeof discEnvelopeJson != 'undefined') {
        discEnvelopeJson.clearLayers();
    }
    if (typeof fmpEnvelopeJson != 'undefined') {
        if (typeof includeDisc == 'undefined') {
            includeDisc = false
        }
        /*
        wait, what? well, there are some unique situations where we don't wanna automatically clear this one -- e.g. when a disc comes in straight from FMP
        */
        if (includeDisc == true) {
            // do the clear
            fmpEnvelopeJson.clearLayers();
        }
    } else {
        // actually do nothing
    } //fmpEnvelopeJson
    if (typeof hitCoverageJson != 'undefined') {
        hitCoverageJson.clearLayers();
    }
    if (typeof specials != 'undefined') {
        specials.clearLayers();
    }
    if (typeof updatesJson != 'undefined') {
        updatesJson.clearLayers();
    }
    // hitEnvelopeJson.clearLayers()
    // hitCoverageJson.clearLayers()
}

function randomStyle() {
    var styles = [{
        "color": "#394834",
        "fillColor": "#394834",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#486f95",
        "fillColor": "#486f95",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#A64800",
        "fillColor": "#A64800",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#A64800",
        "fillColor": "#A64800",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#260F1C",
        "fillColor": "#260F1C",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#2A2E12",
        "fillColor": "#2A2E12",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#414622",
        "fillColor": "#414622",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#8C510A",
        "fillColor": "#8C510A",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#DFC27D",
        "fillColor": "#DFC27D",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#01665E",
        "fillColor": "#01665E",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#4D4D4D",
        "fillColor": "#4D4D4D",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#e86000",
        "fillColor": "#e86000",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#5e399b",
        "fillColor": "#5e399b",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#b5a221",
        "fillColor": "#b5a221",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }, {
        "color": "#656033",
        "fillColor": "#656033",
        "weight": 2,
        "opacity": .9,
        "fillOpacity": polyOpacity
    }];
    var max = styles.length;
    var which = _.random(0, max);
    return styles[which]
}

function addFromCoordinates(coordstring, label) {
    /*
we wanna just take a coordinate pair, convert it to wkt, throw it to addFromWKT since we have that already
*/
var coordarr = coordstring.split(',')
var clength = coordarr.length
if (clength > 2) {
        // must be a poly
        var west = coordarr[0]
        var south = coordarr[1]
        var east = coordarr[2]
        var north = coordarr[3]
        var wkt = "POLYGON ((" + west + " " + south + ", " + east + " " + south + ", " + east + " " + north + ", " + west + " " + north + "))"
            //
        } else {
            var wkt = "POINT (" + coordarr[1] + " " + coordarr[0] + ")"
        }
        addFromWKT(wkt, label)
    }

    function addFromWKT(wktstring, label) {
    /*
	we wanna be able to send a WKT-formatted polygon string and label and have the Wicket library make a map object from it and add it to the geoFromWKT layer group
	*/
    var pointorpoly = detectWKTType(wktstring);
    // var pointorpoly='point';
    // Create a new Wicket instance
    wkt = new Wkt.Wkt();
    // Read in the passed-in poly WKT string
    wkt.read(wktstring);
    obj = wkt.toObject(this.map.defaults); // Make an object
    // obj.addTo(this.map); // Add it to the map
    obj.addTo(geoFromWKT); // Add it to the map's geoFromWKT group
    if (pointorpoly == 'poly') {
        // just some random style from our random styler
        var polystyle = randomStyle();
        if (typeof polystyle == 'undefined') {
            var polystyle = {
                "color": "#656033",
                "fillColor": "#656033",
                "weight": 2,
                "opacity": .9,
                "fillOpacity": polyOpacity
            }
        }
        // give it that style
        obj.setStyle(polystyle);
        // give it that label
        obj.bindLabel(label);
        // let's do a reveal (kinda)
        map.fitBounds(obj.getBounds());
    } //pointorpoly==poly
    else if (pointorpoly == 'point') {
        // map.panTo(obj);
        obj.bindPopup(label).openPopup()
        map.setView(obj._latlng, 6)
    } //pointorpoly==point
    // and give a true to the caller
    return true
}

function addDiscsMenu(discjson, disc) {
    // console.log("in addDiscsMenu")
    // console.log("discjson:"); console.log(discjson);
    /*
	given a json from given series' discs array
	we make a disc menu collection out of them
	*/
    if (typeof disc == 'undefined') {
        hitdisc = '';
    } else {
        hitdisc = disc
    }
    var style = randomStyle();
    var highlitstyle = {
        "color": "#f1cd24",
        "fillColor": "#f1cd24",
        "weight": 3,
        "opacity": 1,
        "fillOpacity": .9
    }
    var discCollection = new DiscCollection(discjson);
    discsMenuView = new DiscsMenuView({
        collection: discCollection,
        activedisc: hitdisc
    });
}

function addDiscsPolys(discjson, disc) {
    console.log("disc:");
    console.log(disc);
    markerLayer.clearLayers();
    /*
	given a json from given series' discs array
	we make leaflet objects using wicket, add them to the discEnvelopeJson layer group
	*/
    // just some random style from our random styler
    if (typeof disc == 'undefined') {
        hitdisc = '';
    } else {
        hitdisc = disc
    }
    console.log("hitdisc:"); console.log(hitdisc);
    var style = randomStyle();
    var highlitstyle = {
        "color": "#f1cd24",
        "fillColor": "#f1cd24",
        "weight": 3,
        "opacity": 1,
        "fillOpacity": .5
    }
    var consolemsg = "disc envelopes for the entire series were rendered on the map";
    var invalids = [];
    // ok listen - some of these series just have too many polys so we gotta order on the map by area *before* we add them
    var discjsonsor = _.sortBy(discjson, function(d) {
     if(typeof d.envelope !== 'undefined' && d.envelope !== '' && d.envelope !== null)
     {
    	// var thisarea = turf.area(wellknown.parse(d.envelope))
        return turf.area(wellknown.parse(d.envelope))*-1} else {return 1;}
    });
    $.each(discjsonsor, function(index, value) {
    // $.each(discjson, function(index, value) {
        // console.log("value:"); console.log(value);
        // console.log("hitdisc:"); console.log(hitdisc);


        // Create a new Wicket instance
        var wkt = new Wkt.Wkt();
        if (value.envelope !== '') {
            // Read in the passed-in poly WKT string
            wkt.read(value.envelope);
            var obj = wkt.toObject(); // Make an object
            // HEY HEY! look at my fake labels on the centroid!
            var roid = obj.getBounds().getCenter();
            var myIcon = L.icon({
                iconUrl: 'images/icon-empty.png',
                iconSize: [1, 1],
                iconAnchor: [-0, 0],
                labelAnchor: [-15, 0]
            });
            var menupop = $('<a href="../api/v1/zip/' + value.series + '/' + value.resid + '" target="_blank">click to download the entire ' + value.resid + '.zip file</a>').click(function() {
                // map.closePopup();
            })[0];
            // var m = L.marker(roid, {
            //     icon: myIcon
            // }).bindLabel(value.resid, {
            //     noHide: true,
            //     className: "disclabel"
            // }).addTo(markerLayer).showLabel().bindPopup(menupop);
            // markerLayer.addLayer(m)
            if (value.resid.toUpperCase() == hitdisc.toUpperCase()) {
                obj.setStyle(highlitstyle);
                obj.options.active = true
                map.fitBounds(obj.getBounds());
            } else {
                // give it default style
                obj.setStyle(style);
                // $(".activedisc").tooltip('show')
            } //end of resid==hitdisc
            obj.bindLabel(value.resid,{noHide:true,direction:'auto'}).addTo(discEnvelopeJson).bindPopup(menupop); // Add it to the layer group
        }
        // at the very least bring the highlighted one forward

            // obj.bindLabel(value.resid,{noHide:true,direction:'auto'});
            // } else {
            // 	// value.envelope was empty
            // 	// consolemsg+=" (not rendered:"+value.resid+")"
            // 	invalids.push(value.resid)
            // }
        });
    if (invalids.push.length > 0) {
        var invstring = invalids.join()
        consolemsg += " (not rendered: " + invstring + ")";
    }

    var ad = _.find(discEnvelopeJson._layers, function(m) {return m.options.active == true});
    discEnvelopeJson._layers[ad._leaflet_id].openPopup()
        // .bringToFront()

    // probably started an activity message when we requested stuff, kill it here in case it takes a long time to loop through the returned JSON
    // map.fitBounds(discEnvelopeJson.getBounds());
    appActivityView.reset()
    appConsole.set({
        message: consolemsg
    })
}

function addFMPDisc(poly, label) {
    /*
	given a poly from an FMP disc reference
	we make a leaflet obj using wicket, add it to the fmpEnvelopeJson layer group
	*/
    var polystyle = randomStyle();
    if (typeof polystyle == 'undefined') {
        var polystyle = {
            "color": "#656033",
            "fillColor": "#656033",
            "weight": 2,
            "opacity": .7,
            "fillOpacity": polyOpacity
        }
    }
    // Create a new Wicket instance
    wkt = new Wkt.Wkt();
    // Read in the passed-in poly WKT string
    wkt.read(poly);
    obj = wkt.toObject(this.map.defaults); // Make an object
    // give it that style
    obj.setStyle(polystyle);
    var labelpreamble = "spatial extent of " + label;
    // var labelpreamble = '<strong>'+label+'</strong>. When this envelope showing, download requests are trimmed to this box rather the current map extent).';
    // give it that label
    obj.bindLabel(labelpreamble);
    // console.log("poly:"); console.log(poly);
    // killswitch is just the active component of the popup, so we bind a click action to the string itself
    var killswitch = $('<span id="killthislayer">click to remove this envelope from the map</a>').click(function() {
        masterClearLayers(true);
        map.closePopup();
    })[0];
    // marker.bindPopup(link);
    // obj.addTo(fmpEnvelopeJson); // Add it to the layer group
    obj.addTo(fmpEnvelopeJson).bindPopup(killswitch); // Add it to the layer group
    // obj.addTo(this.map); // Add it to the map
    // let's do a reveal (kinda)
    // map.panTo(obj.getBounds().getCenter());
    map.fitBounds(obj.getBounds());
    appConsole.set({
        message: label + " -- its envelope was rendered on the map"
    })
        // and give a true to the caller
        return true
    }

    function addHitGeoJSONPoly(geofrag, label) {
        // var hitStyle = {
        // 	"color": "#5c7f92",
        // 	"weight": 2,
        // 	opacity: 0.85
        // };
        var hitStyle = randomStyle();
        var geojson = L.geoJson(geofrag, {
            // style for all vector layers (color, opacity, etc.), either function or object (optional)
            style: hitStyle,
            onEachFeature: function(feature, layer) {
                layer.bindLabel(label, {
                    noHide: true
                })
            }
        });
        return geojson;
    }
    /* ----------
    wake the kids?
    this is a global func that takes a passed dom element
    and basically just toggles the visibility of its siblings --
    used to show/hide the guts of paneContainer based on the active route
    ------------ */
    function wakeTheKids(el, extruz, panewidth) {
        // force errant activity messages to disappear
        appActivity.unset("message").unset("caller")
            // force any collapsed/hidden elements back open
            $("#paneContainer, #header, #navContainer").show()
            $("#paneContainer").removeClass('panecollapsed');
            $("#paneContainer").removeClass('fast');
        // first we do a clear of any existing span* classes
        // we'll let the calling tab handle width
        $("#paneContainer").removeClass(function(index, css) {
            return (css.match(/\bspan\S+/g) || []).join(' ');
        });
        if (typeof panewidth !== 'undefined') {
            $("#paneContainer").addClass(panewidth);
        }
        /* ----------
        it's probably ok to have a global killer of some stuff that triggers upon an href click, y?
        ------------ */
        $('.popover').hide();
        appActivityView.reset()
        $('.nav-tabs').find('a[href="#' + el + '"]').tab('show');
        var ttl = "LL GeoData: " + el;
        if (typeof extruz != 'undefined') {
            ttl += " -- " + extruz;
        }
        $(document).attr("title", ttl);
    }

    $(function() {
    // this is reusable layer we use to zoomto various selections
    // e.g. freebase result
    geojsonZoom = L.geoJson().addTo(map);
    geoFromWKT = new L.LayerGroup().addTo(map);
    // container groups for preview layers
    hitPreviews = new L.LayerGroup().addTo(map);
    rasterEnvelopes = new L.LayerGroup().addTo(map);
    // here we wire a key for toggling the main pane
    $(document).keydown(function(e) {

var clazz="out"
if(e.keyCode==17){
    clazz="split"
     if ($("#appendedInputButtons").is(":focus") == false) {

                // appState.toggle('split');
                appState.toggle(clazz);

            }
} else if(e.keyCode==18){
    clazz="down"
     if ($("#appendedInputButtons").is(":focus") == false) {

                // appState.toggle('split');
                appState.toggle(clazz);

            }
}


    });

    $(document).keydown(function(e) {
        if (e.keyCode == 192) {
            if ($("#appendedInputButtons").is(":focus") == false) {
                // $("#paneContainer, #header, #navContainer, #consoleContainer").toggle();
                $("#paneContainer, #header, #navContainer").toggle();
                $(".popover").hide();
                $(".tooltip").hide();
                // appConsole.set({"message":"press the '`' key (under 'esc') to toggle the element's visibility"})
                if (appActivity.get("caller") == "backtick") {
                    appActivityView.reset()
                    appActivity.unset("caller")
                } else {
                    appActivity.set({
                        message: "the '`' key (under 'esc') will re-show the hidden elements",
                        caller: "backtick"
                    });
                } //caller=backtick
            }
        }
    });
    $('#mnuBaseMap').mouseenter(function() {
        $(this).switchClass("", "up", 50, "linear");
    }).mouseleave(function() {
        $(this).switchClass("up", "", 100, "linear");
    });
});
    $(document).ready(function() {

        $(".triage-hider").click(function(e){triageQueryView.unrender()})
        $(".triage-wrapper-bt-close").click(function(e){triageQueryView.unrender()})

// well this aint great #returnto but some complex manual popovers (e.g. md5 hashes) won't self-close on blur
$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

});
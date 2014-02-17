var googleStreetViewService = new google.maps.StreetViewService();
var panorama = null;
var geocoder = new google.maps.Geocoder();
humming.MapService.SearchService = function ()
{

    // initialise the jqueryUI autocomplete element
    this.autocomplete_init= function()  {
        $("#gmaps-input-address").autocomplete({
            source: function (request, response) {
                geocoder.geocode({ 'address': request.term }, function (results, status) {
                    response($.map(results, function (item) {
                        return {
                            label: item.formatted_address, // appears in dropdown box
                            value: item.formatted_address, // inserted into input element when selected
                            geocode: item                  // all geocode data: used in select callback event
                        }
                    }));
                })
            },
            // event triggered when drop-down option selected
            select: function (event, ui) {
                update_ui(ui.item.value, ui.item.geocode.geometry.location)
                update_map(ui.item.geocode.geometry)
            }
        });

        // triggered when user presses a key in the address box
        $("#gmaps-input-address").bind('keydown', function (event) {
            if (event.keyCode == 13) {
                geocode_lookup('address', $('#gmaps-input-address').val(), true);

                // ensures dropdown disappears when enter is pressed
                //$('#gmaps-input-address').autocomplete("disable")
            } else {
                // re-enable if previously disabled above
                //  $('#gmaps-input-address').autocomplete("enable")
            }
        });
    }; // autocomplete_init

    update_ui =function(address, latLng) {
        $('#gmaps-input-address').autocomplete("close");
        $('#gmaps-input-address').val(address);
        //$('#gmaps-output-latitude').html(latLng.lat());
        //$('#gmaps-output-longitude').html(latLng.lng());
    }
    // move the marker to a new position, and center the map on it
    function update_map(geometry) {
        var map = MapTool.getLayerOfMapByName("google satellite")
        map.fitBounds(geometry.viewport)
        //marker.setPosition(geometry.location)
    }

    function geocode_lookup(type, value, update) {
        // default value: update = false
        update = typeof update !== 'undefined' ? update : false;

        request = {};
        request[type] = value;

        geocoder.geocode(request, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                // Google geocoding has succeeded!
                if (results[0]) {
                    // Always update the UI elements with new location data
                    update_ui(results[0].formatted_address,
                               results[0].geometry.location)

                    // Only update the map (position marker and center map) if requested
                    if (update) { update_map(results[0].geometry) }
                } else {
                    // Geocoder status ok but no results!?
                    //$('#gmaps-error').html("Sorry, something went wrong. Try again!");
                    //$('#gmaps-error').show();
                }
            } else {
                // Google Geocoding has failed. Two common reasons:
                //   * Address not recognised (e.g. search for 'zxxzcxczxcx')
                //   * Location doesn't map to address (e.g. click in middle of Atlantic)

                if (type == 'address') {
                    // User has typed in an address which we can't geocode to a location
                    //$('#gmaps-error').html("Sorry! We couldn't find " + value + ". Try a different search term, or click the map.");
                    //$('#gmaps-error').show();
                } else {
                    // User has clicked or dragged marker to somewhere that Google can't do a reverse lookup for
                    // In this case we display a warning, clear the address box, but fill in LatLng
                    //$('#gmaps-error').html("Woah... that's pretty remote! You're going to have to manually enter a place name.");
                    //$('#gmaps-error').show();
                    update_ui('', value)
                }
            };
        });
    };


    function SearchPOI() {
        var myUrl = "http://127.0.0.1:8180/hummingcloudsearch/searchpoi/12";// + escape(InputValue) + "&limitAmount=10";
        $.ajax({
            url: myUrl,
            type: 'GET',
            dataType: 'json',
            async: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            success: function (result) {
                if (result) {
                    Map.addMarker(result.x, result.y);
                    Map.setCenterLonlat(result.x, result.y, 3);

                }
            }
        });
    }

    function searchnavstart() {
        if (MapTool == null)
            return;
        navstartpnt = MapTool.getCenterLonlat();
        //Map.getLayerOfMap("google satellite");
    }

    function searchnavend() {
        if (MapTool == null)
            return;
        if (navstartpnt == null) {
            alert("没有设置导航起点");
            return;
        }
        navsendnpnt = MapTool.getCenterLonlat();
        navsearch(navstartpnt, navsendnpnt);
    }

    function navsearch(startpnt, endpnt) {
        if (startpnt == null || endpnt == null)
            return;
        var httprequest = "http://maps.googleapis.com/maps/api/directions/json?origin=37.458060333333336%2c118.49971400000001&destination=37.458260333333336%2c118.50971400000001&sensor=false";
        var mode = google.maps.DirectionsTravelMode.DRIVING;	//谷歌地图路线指引的模式
        var directionsDisplay = new google.maps.DirectionsRenderer();	//地图路线显示对象
        var directionsService = new google.maps.DirectionsService();	//地图路线服务对象
        var directionsVisible = false;	//是否显示路线
        directionsDisplay.setMap(null);
        directionsDisplay.setMap(MapTool.getLayerOfMapByName("google satellite"));
        directionsDisplay.setPanel(document.getElementById("simpleMap"));	//将路线导航结果显示到div中	
        var request = { origin: new google.maps.LatLng(startpnt.lat, startpnt.lon), destination: new google.maps.LatLng(endpnt.lat, endpnt.lon), travelMode: mode, optimizeWaypoints: true, avoidHighways: false, avoidTolls: false };
        directionsService.route
        (
            request,
            function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            }
        );
        directionsVisible = true;
    }
    function address2pnt(straddress) {
        //1.地理解析过程
        //请求数据GeocoderRequest为address，值为'贵阳'
        geocoder.geocode({ address: straddress }, function geoResults(results, status) {
            //这里是回掉函数(即结果处理函数)
            //状态为Ok说明有结果
            if (status == google.maps.GeocoderStatus.OK) {
                //一般情况下会有多个结果
                //第一个结果为最佳匹配的结果（匹配地名最全的结果），这里只去第一个，其他的可以根据需要自己循环出来
                //格式化过后的地址
                alert('地理解析结果：' + results[0].formatted_address);
                //geometry是一个包含bounds（界限），location（纬度/经度坐标）,location_type和viewport（视图范围）
                //获取解析后的经纬度      
                alert('地理解析结果：' + results[0].geometry.location);
            } else {
                alert("：error " + status);
            }
        });
    }

    function pnt2address(lon, lat) {
        //2.地理反解析过程
        //请求数据GeocoderRequest为location，值类型为LatLng因此我们要实例化经纬度
        geocoder.geocode({ location: new google.maps.LatLng(lat, lon) }, function geoResults(results, status) {
            //这里处理结果和上面一模一样
            if (status == google.maps.GeocoderStatus.OK) {
                alert('地理反解析结果：' + results[0].formatted_address);
                alert('地理反解析结果：' + results[0].geometry.location);
            } else {
                alert("：error " + status);
            }
        });
    }
    function geocode2pnt() {
        //var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': "北京市东城区东直门，或北京市,东城区,东直门"
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                myLatLng = results[0].geometry.location;
                MapTool.zoomToLonLat(new OpenLayers.LonLat(myLatLng.e, myLatLng.d), 12);
                alert("地址编码返回成功,北京市东城区东直门");
                //results数组里有很多有用的信息，包括坐标和返回的标准位置信息
            } else {
                alert("地址定位失败");
            }
        });
    }

    function placesearch() {
        var pyrmont = new google.maps.LatLng(30.8665433, 114.1956316);

        var request = {
            location: pyrmont,
            radius: 5000,
            types: ['store']
        };
        //infowindow = null;
        //infowindow = new google.maps.InfoWindow();
        var map = MapTool.getLayerOfMapByName("google satellite")
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
        MapTool.zoomToLonLat(new OpenLayers.LonLat(114.1956316, 30.8665433), 6);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                if (i > 50)
                    return;
                createMarker(results[i]);
            }
        }
    }

    function performSearch() {
        var map = MapTool.getLayerOfMapByName("google satellite")
        var request = {
            bounds: map.getBounds(),
            keyword: '武汉大学'
        };
        service = new google.maps.places.PlacesService(map);
        service.radarSearch(request, performSearchcallback);
    }
    function performSearchcallback(results, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
        }
        for (var i = 0, result; result = results[i]; i++) {
            var marker = new google.maps.Marker({
                map: map,
                position: result.geometry.location
            });
        }
    }
    ///////////////////////////////
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var map = MapTool.getLayerOfMapByName("google satellite")
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }
}

humming.MapService.StreetService = function () {
    function initstreetmap() {
        //MapTool.openmap.addLayer(layer);
        panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), panoramaOptions);
        var layer = MapTool.openmap.getLayersByName("google satellite");
        var googlemap = layer[0].mapObject;
        googlemap.setStreetView(panorama);
    }
    function processSVData(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
            var layer = map.getLayersByName("google satellite");
            var googlemap = layer[0].mapObject;
            var marker = new google.maps.Marker({
                position: data.location.latLng,
                map: googlemap,
                title: data.location.description
            });
            var markerPanoID = data.location.pano;
            // Set the Pano to use the passed panoID
            panorama.setPano(markerPanoID);
            panorama.setPov({
                heading: 270,
                pitch: 0,
                zoom: 1
            });
            panorama.setVisible(true);
            google.maps.event.addListener(marker, 'click', function () {
            });
        }
    }
}
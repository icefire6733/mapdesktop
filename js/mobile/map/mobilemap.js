

//////////////////////////////////////////////////////////////////////////////////////////////////////
var JsObject = {};
JsObject.namespace = function () //在JsObject对象下定义一个函数namespace 
{
    /*下面代码中arguments为函数传入的参数，在function未明确定义参数时， 
   　　function也可以传入参数，并用arguments来 接收，arguments类似数组， 
   　　如果传入多个参数，将按顺序保存，取值法：arguments[0],arguments[1]....*/
    var a = arguments, o = null, d, rt;
    for (var i = 0; i < a.length; i++) {
        d = a[i].split('.'); //将传入的参数用符号'.' 进行分割，并放入d数组中。 
        rt = d[0];
        //判断数组中的第一个值是否未定义，如果未定义，便定义为空对象{},并赋值给变量o 
        eval('if (typeof ' + rt + ' == "undefined"){'
        + rt + ' = {};} o = ' + rt + ';');
        for (var j = 1; j < d.length; j++) {
            /*循环遍历数组d每个值作为key，加入到对象o中，如果key在o中存在，则取o中值，若 
        　　　　不存在，则赋值为空对象{} */
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
}
JsObject.namespace("humming.Search"); //申明命名空间
JsObject.namespace("humming.Map");
JsObject.namespace("humming.MapService");
JsObject.namespace("humming.Map3d");
JsObject.namespace("humming.Navigation");
JsObject.namespace("humming.Uitily");

var openmap = null;
humming.Map.mapTool = function () {
    this.projection = new OpenLayers.Projection("EPSG:900913");
    //数据采用的坐标系  
    this.displayProjection = new OpenLayers.Projection("EPSG:4326");
    this.initmap = function () {
        //构造地图对象实例,并添加到id为simpleMap的div容器中
        if (openmap == null) {
            // map = new OpenLayers.Map('simpleMap', { maxResolution: 'auto' });
            openmap = new OpenLayers.Map('simpleMap', {
                maxExtent: new OpenLayers.Bounds(//设置地图域
                -128 * 156543.0339,
                -128 * 156543.0339,
                128 * 156543.0339,
                128 * 156543.0339),
                maxResolution: 156543.0339,//最大分辨率
                units: 'm',//度量单位
                projection: this.projection,//投影规则
                displayProjection: this.displayProjection,//显示的投影规则
            });

            var layer2 = new OpenLayers.Layer.Google("google satellite", { type: google.maps.MapTypeId.SATELLITE, numzoomlevels: 20 });
            openmap.addLayer(layer2);

            var layer3 = new OpenLayers.Layer.Google("google roadmap", { type: google.maps.MapTypeId.ROADMAP, numzoomlevels: 22 });
            openmap.addLayer(layer3);
            var fenway = new google.maps.LatLng(42.345573, -71.098326);
            var panoramaOptions = {
                position: fenway,
                pov: {
                    heading: 34,
                    pitch: 10,
                    zoom: 1
                }
            };

            openmap.setCenter(new OpenLayers.LonLat(114, 30), 3);
            openmap.addControl(new OpenLayers.Control.LayerSwitcher());
           // openmap.events.register("click", openmap, this.onMapClick);
            //autocomplete_init();
        }
    };
    ////////////////////地图事件//////////////////////////////
    this.onMapClick=function(e)
    {

        var lonlat = openmap.getLonLatFromPixel(e.xy);
       
        var p = lonlat.transform(this.projection, this.displayProjection);
        //  p = p.transform(this.displayProjection, this.projection);
        var pyrmont = new google.maps.LatLng(lonlat.lat, lonlat.lon);
       // googleStreetViewService.getPanoramaByLocation(pyrmont, 50, processSVData);
        OpenLayers.Event.stop(e);
    }
    ////////////////////////////////////////

    this.zoomToLonLat = function (lonlat, zoom) {

        var p = lonlat.transform(this.displayProjection, this.projection);
        openmap.setCenter(p, zoom, false, true);
    },       
    //获取2D地图视野范围 
    this.getBound = function () {
        //var bound = document.getElementById("iframe").contentWindow.map.getExtent();
        var bound = openmap.getExtent();
        //   var bound = document.getElementById("simpleMap").map.getExtent();
        return bound;//
    }

    //设置2D地图视野范围 
    this.setBound = function (bound) {
        map.zoomToExtent(bound);
    }

    //获取地图中心
    this.getCenterLonlat = function () {
        //var lonlat = map.getCenter();
        var mapobj =this.getLayerOfMapByName("google satellite");
        var point = mapobj.getCenter();
        var lonlat=new OpenLayers.LonLat(point.e,point.d);
        return lonlat;
    }

    //设置地图中心
    this.setCenterLonlat = function (lon, lat) {
        var lonlat = openmap.setCenter(new Geo.LonLat(lon, lat), map.getZoom());
        return lonlat;
    }

    //设置地图中心和地图级别
    this.setCenterLonlat = function (lon, lat, zoom) {
        var lonlat = openmap.setCenter(new OpenLayers.LonLat(lon, lat), zoom, true, true);
        return lonlat;
    }

    //设置地图中心和地图级别
    this.getZoom = function () {
        var zoom = map.getZoom();
        return zoom;
    }

    //设置地图中心和地图级别
    this.setZoom = function (zoom) {
        map.zoomTo(zoom);
    }

    //放大地图 
    this.zoomIn = function () {
        map.zoomIn();
    }
    //缩小地图 
    this.zoomOut = function () {
        map.zoomOut();
    }

    ///////////////////////////////////事件////////////////////////////////////////////////////
    //功能：使用鼠标右键点击位置设置导航起点坐标
    //参数 
    //作者：zj
    this.changeNavstartpoint = function (startLon, startLat) {
        startLon = pointX;
        startLat = pointY;
        var startpoint = [startLon, startLat];
        return startpoint;
    }


    //功能：使用鼠标右键点击位置设置导航终点点坐标
    //参数 
    //作者：zj
    this.changeNavendpoint = function (endLon, endLat) {
        endLon = pointX;
        endLat = pointY;
        var endpoint = [endLon, endLat];
        return endpoint;
    }

    this.setCenterandMark = function (startLon, startLat, endLon, endLat) {
        //确定定位中心点到起点，设置地图缩放级别为11
        var zoom = this.getZoom();
        if (zoom <= 11) {
            this.setCenterLonlat(startLon, startLat, 11);
        }
    }

    this.getLayerByName = function (layername) {
        var layer = openmap.getLayersByName(layername);
        if (layer.length > 0)
            return layer[0];
        else
            return null;
    }

    this.getLayerOfMapByName = function (layername) {
        var layer = openmap.getLayersByName(layername);
        if (layer.length > 0)
            return layer[0].mapObject;
        else
            return null;
    }
}


humming.Uitily.uitilyTool = function () {
    this.distance = function (x1, y1, x2, y2) {
        var x1 = eval(x1);
        var y1 = eval(y1);
        var x2 = eval(x2);
        var y2 = eval(y2);
        var xdiff = x2 - x1;
        var ydiff = y2 - y1;
        var distance = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        return distance;
    }
    this.showdiv = function (id, bshow) {
        if (bshow) {
            document.getElementById(id).style.display = "block";//显示
        }
        else {
            document.getElementById(id).style.display = "none";//隐藏
        }
    }
    this.divvisible = function (id) {
        if (document.getElementById(id).style.display== "block") {
           return true;//显示
        }
        else {
            return false;//隐藏
        }
    }
    //通过ajax获取Json格式数据
    this.getDataByAjaxUrl = function (url, deal, jsonCallBack) {
        $.ajax({
            beforeSend: function () { $("#wait").show() },
            type: "get",
            async: false,
            cache: false,
            url: url,//+ "?jsoncallback=?",
            contentType: "text/json;charset=utf8",
            dataType: "jsonp",
            jsonp: 'jsoncallback',
            jsonpCallback: jsonCallBack,
            processData: false,
            success: function (resultJson) { deal(resultJson); },
            complete: function () { $("#wait").hide(); },
            error: function (error) { alert("调用出错" + error.responseText); }
        });
    }
}


///////////////////////////////////////功能：全局变量,作者：zj///////////////////////////////////////////////

var timer = null;
var MapTool = new humming.Map.mapTool();
var uitily = new humming.Uitily.uitilyTool();
var navstartpnt = null;
var navendpnt = null;
var infowindow = new google.maps.InfoWindow();

function getTestFun() {
    if (timer != null)
        clearInterval(timer);
    else
        timer = setInterval(getTestFun2, 100);
}//"http://192.168.1.234:8080/HummingMapRest/hello/test";// 
function getTestFun2() {
    var myUrl = "http://127.0.0.1:8182/hummingcloudsearch/chinesewordseg/%E6%AD%A6%E6%B1%89%E6%9C%80%E5%A5%BD%E7%8E%A9%E7%9A%84%E5%9C%B0%E6%96%B9";// "http://127.0.0.1:8182/Humming/test/d/b";// + escape(InputValue) + "&limitAmount=10";
    $.ajax({
        url: myUrl,
        type: 'GET',
        dataType: 'json',
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        success: function (result) {
            if (result) {

            }
        }
    });
}


////////////////////////////
function onshow1() {
    var layer = MapTool.getLayerByName("google satellite");
   // var bvisible = layer.getVisibility();
    layer.setVisibility(false);

    var layer = MapTool.getLayerByName("google roadmap");
    var bvisible = layer.getVisibility();
    layer.setVisibility(true);
}

function onshow2() {
    var layer = MapTool.getLayerByName("google satellite");
    //var bvisible = layer.getVisibility();
    layer.setVisibility(true);

    var layer = MapTool.getLayerByName("google roadmap");
    //var bvisible = layer.getVisibility();
    layer.setVisibility(false);
}

function onshow3() {
    if (uitily.divvisible("pano")==true)
        uitily.showdiv("pano", false);
    else
        uitily.showdiv("pano", true);
}

function ongeocode2pnt()
{
    SearchServiceTool.geocode2pnt();
}

function onplacesearch()
{
    SearchServiceTool.placesearch();
}

function performSearch()
{
    SearchServiceTool.performSearch();
}

function onSearchPOI()
{
    SearchServiceTool.SearchPOI();
}

function onsearchnavstart()
{
    SearchServiceTool.searchnavstart();

}

function onsearchnavend()
{
    SearchServiceTool.searchnavend();

}
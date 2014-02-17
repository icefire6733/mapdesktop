// JavaScript Document

function getScript(url,obj){

    if(window.navigator.userAgent.indexOf("MSIE 6.0")>0){//IE6

        $.getScript(url,obj);

    }else{//other

        var s = document.getElementById("itemList");

        if(s!=null){

            document.getElementsByTagName("head")[0].removeChild(s);

        }

        s = document.createElement("script");

        s.id = "itemList";

        s.type = "text/javascript";

        s.src = url;

        var head = document.getElementsByTagName("head")[0]; //获取head结点，并将<script>插入到其中  

        head.appendChild(s);

        var temp;

        var self = this;//获取对象自身的引用 

        if (window.navigator.userAgent.indexOf("MSIE")>0) {//IE

            s.onreadystatechange = function (){

                if(this.readyState=="loaded" || this.readyState=="complete"){//加载完成

                    obj();

                    //alert("加载完成:"+itemList.length);

                }

            }

        }else{//firefox,chrom etc.

            s.onload = function (){

                obj();

            }

        }

    }

}

//根据字符串TRUE OR FALSE返回布尔值

function isResult(result){

    if(result=="true"){

        return true;

    }else{

        return false;   

    }   

}

//根据九宫格字符串值返回常量值

function imageAlign(pos){

    var align;

    switch(pos){//设置图片锚点相对于图片的位置   

        case "TOP_CENTER":

            align= MConstants.TOP_CENTER;

            break;

        case "TOP_RIGHT":

            align= MConstants.TOP_RIGHT;

            break;

        case "TOP_LEFT":

            align= MConstants.TOP_LEFT;

            break;

        case "MIDDLE_LEFT":

            align= MConstants.MIDDLE_LEFT;

            break;

        case "MIDDLE_CENTER":

            align= MConstants.MIDDLE_CENTER;

            break;

        case "MIDDLE_RIGHT":

            align= MConstants.MIDDLE_RIGHT;

            break;

        case "BOTTOM_LEFT":

            align= MConstants.BOTTOM_LEFT;

            break;

        case "BOTTOM_RIGHT":

            align= MConstants.BOTTOM_RIGHT;

            break;

        default:

            align= MConstants.BOTTOM_CENTER;

            break;

    }   

    return align;

}

//根据字符串数据来源返回常量

function dataSources(s){

    var source;

    switch(s){

        case 'DS_BASE':

            source = MConstants.DS_BASE;//基础数据库

            break;

        case 'DS_USERPOI':

            source = MConstants.DS_USERPOI;//编辑器数据库

            break;

        case 'DS_BASE_USERPOI':

            source = MConstants.DS_BASE_USERPOI;//基础+编辑器数据库

            break;

        case 'DS_ENPOI':

            source = MConstants.DS_ENPOI;//企业地标数据库

            break;

        case 'DS_BASE_ENPOI':

            source = MConstants.DS_BASE_ENPOI;//基础+企业地标数据库（默认）

            break;

        case 'DS_BASE_BUS':

            source = MConstants.DS_BASE_BUS;//基础+公交车站数据库

            break;

        default:

            source = MConstants.DS_BASE_ENPOI;

            break;

    }

    return source;

}

function showMapMenu(myStr){//根据内容定制menu，并显示menu在地图上

    var div_temp ="<div class='div_float_head'><img src='images/ico_close.jpg'/><div class='div_float_logo'></div></div><div class='div_float_content'>"+myStr+"</div>";    

    $("#div_float").html(div_temp);

    $("#div_float div[class=div_float_head]").find("img").click(function(){

        $("#div_float").hide();

    });

    $("#div_float").show(500);

    var height = $("#div_float").height();

    if(location.href.indexOf('package.html')!=-1){

        $("#div_float").css({ right: "20px", top: "125px" });

    }else{

        $("#div_float").css({ right: "20px", top: "55px" });

    }

    if(height > 400){//矫正高度，防止过高

        $(".div_float_content").css('height','400px');

        $(".div_float_content").css('overflow','auto');

        $(".div_float_content").css('overflow-x','hidden');

    }else{

        $(".div_float_contentt").css('overflow','');

        $(".div_float_content").css('height','');

    }

}

//解决窗口resize的问题

var reSizeCount=0;

function resize(){

    var tt = window.navigator.userAgent;

    if(tt.indexOf("Chorm")>-1){//chorm

        if(reSizeCount%2==0){autoFrame();}

    }else if(tt.indexOf("Firefox")>-1){//firefox

        autoFrame();

    }else if(tt.indexOf("MISE 8.0")>-1){//IE

        if(reSizeCount%3==0){autoFrame();}

    }else{autoFrame();}

    reSizeCount++;

}



function getUrlGet(key,url){//根据URL中ID获得VALUE

    if(!url){

        var url = location.href;

    }

    url = url.split("?");

    if(!url[1]){return;}

    var prarm = url[1].split("&");

    for(var i=0;i<prarm.length;i++){

        var t = prarm[i].split("=");

        if(t[0]==key){

            return t[1];

        }

    }

    return null;

}

function pageHeight(){//返回页面高度

    if($.browser.msie){

        return document.compatMode == "CSS1Compat"? document.documentElement.clientHeight :

        document.body.clientHeight;

    }else{

        return self.innerHeight;

    }

};

function colorEditor(){

    var f = $.farbtastic('#picker');

    var p = $('#picker').css('opacity', 0.25);

    $('.colorwell')

    .each(function (){

        f.linkTo(this);

        $(this).css('opacity', 0.75); 

    }).click(function() {

        f.linkTo(this);

        p.css('opacity', 1);

        $("#picker").css('top',$(this).position().top+70+"px");

        $("#picker").css('left',($(this).position().left+683+this.offsetWidth)+"px");

        $('#picker').show();

    });

    $("#picker").append('<img src="images/ico_close.jpg" title="关闭"/>');

    $("#picker img").click(function(){

        $('#picker').hide();

    });

    $("#picker").hover(

        function() {

            $("#picker").show(500);

        },

        function() {

            $("#picker").hide(500);

        }

    );  

}

function test(data){

    var temp = '<font style="color:red">下面是对象遍历结果,仅用于调试和查看对象</font><br>';

    var tData = data;

    for (var parm in tData){

        //依次显示对象中的所有属性

        if(typeof(tData[parm])=="object"){

            temp += "属性： '" + parm + "' 值： <br>";

            var dData = tData[parm];

            for (var tparm in dData){

                temp += "--属性： '" + tparm + "' 值： " + dData[tparm]+"<br>";

            }

        }else{

            temp += "属性： '" + parm + "' 值： " + tData[parm]+"<br>";

        }

    }

    showMapMenu(temp);  

}

/*返回显示隐藏常量*/

function getConstantsSH(s){

    var sh;

    switch(s){

        case 'SHOW':

            sh = MConstants.SHOW;

            break;

        case 'HIDE':

            sh = MConstants.HIDE;

            break;

        default:

            sh = MConstants.SHOW;

            break;

    }

    return sh;

}
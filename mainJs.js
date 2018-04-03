var local = {};
local.avatar = "iqlogo.png";

var remote = {};
remote.avatar = "https://developers.viber.com/images/apps/apiai-icon.png";
var SESSIONID=generateUUID();
var accessToken = "3c44974b43934bbdb1fdc030b17df30e";
var baseUrl = "https://api.api.ai/v1/";
var Opurl="https://nwave-ideabot-flask-webhook-p.herokuapp.com/getop/";
var url=Opurl+SESSIONID;
function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

function insertChat(who, text){
    var control = "";
    var date = formatTime(new Date());
    
     if (who == "local"){
        
         control = '<li style="width:100%;float:right;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +                                                       
                  '</li>';                   
    }else{
        control = '<li style="width:100%;align:right;">' +
                        '<div class="msj macro">' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';   
    }
    $("#messages").append(control);
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

$("#chat-panel").on('click',function(){
var framewidth = $("#frame").width();
var op="";
if(framewidth > 150 ){
	framewidth = "125";
	op="0.1";
}else {
	framewidth = "370";
	op="1";
}
$(".innerframe").animate({height: 'toggle',opacity: op});
$('#frame').animate({ width: framewidth,background:"black"});
});
 
function resetChat(){
    $("#messages").empty();
}

$(".mytext").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("local", text);              
            $(this).val('');
            queryBot(text)
        }
    }
});

resetChat();

function queryBot(text) {
            $.ajax({
                type: "POST",
                url: baseUrl + "query?v=20150910",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                data: JSON.stringify({ query: text, lang: "en", sessionId: SESSIONID }),
                
		success: function(data) {
                    insertChat("remote",data.result.fulfillment.speech);
                },
                error: function() {
                    insertChat("remote","Sorry Bot has faced some issues! Please try again later");
                }
            });
    }
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

$(document).ready(function(){
    $("#myHref").click(function(event){
        document.getElementById("myData").setAttribute('data',url);
	$("#myHref").hide();
	$("#closeOp").show();
	return false;
    });
});
$("#closeOp").click(function(){
	document.getElementById("myData").setAttribute('data',url);
	$("#closeOp").hide();	
	$("#myData").hide();
	$("#myHref").show();
});


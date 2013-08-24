$(document).ready(function(){
    mouse_hover_image()
	
	$('#block_main').scroll(function () {
    if(current_request_pages)
    {
		//console.log(" block= " + $("#block_main").height() + " scroll = " + $("#block_main").scrollTop() + " document = " + $("#block_main").prop('scrollHeight') + " suma = " + ($("#block_main").height() + $("#block_main").scrollTop()));
        
        if ($("#block_main").height() + $("#block_main").scrollTop() >= $("#block_main").prop('scrollHeight') - 100) {
            add_pages();
            current_request_pages = null;   
        }
    }
	});
	//iconos ui
	/*
	$(".ui-icono-person").button({icons: {primary: "ui-icon-person"}}).css({"border":"none", "background": "none"});
	$(".ui-icono-inicio").button({icons: {primary: "ui-icon-home"}}).css({"border":"none", "background": "none"});
	$(".ui-icono-cole").button({icons: {primary: "ui-icon-folder-collapsed"}}).css({"border":"none", "background": "none"});
	$(".ui-icono-confi").button({icons: {primary: "ui-icon-wrench"}}).css({"border":"none", "background": "none"});
	
	$(".ui_visit").button({icons: {primary: "ui-icon-flag"}}).css({"border":"none", "background": "none"});
	$(".ui_autor").button({icons: {primary: "ui-icon-person"}}).css({"border":"none", "background": "none"});
	$(".ui_tipo").button({icons: {primary: "ui-icon-tag"}}).css({"border":"none", "background": "none"});
	$(".ui_gusta").button({icons: {primary: "ui-icon-heart"}}).css({"border":"none", "background": "none"});
	$(".ui_nogusta").button({icons: {primary: "ui-icon-cancel"}}).css({"border":"none", "background": "none"});
	*/
	document.getElementById("search").focus();
	$(document).scrollTop(0);
	
	//radialgradient(['fuch','#0893d7',"#035F8C",'100','MC']);
	lineargradient(['block_sub_menu','#0893d7',"#035F8C", '600','R'])
	
});

var current = "";
var current_block = null;
//gestor actual de datos youtube o vimeo
var current_gst = true;
var gestor_busquedas = "fleet";

function check(){
    if(current_block)toggle(false);
    if(current_gst){
        if(current != ""){
            ytplayer.pauseVideo();
            document.getElementById(current + "rep").style.display = "none";
            current = "";
        }
    }
    else{
        document.getElementById(current).innerHTML = "";
    }
}
//580 * 420
function alerta(event){
	//esta funcion sirve para cadavez que le den click en play en un feed reproducira el video ya sea de youtube o vimeo
	save_visit(this.childNodes[1].value);
    event.preventDefault();
    check();
    current_block = this.parentNode;
    toggle(true);
    if(this.childNodes[3].value == "youtube"){
        current = this.childNodes[1].value;
        current_gst = true;
        if(this.childNodes[2].value == "false"){
            this.childNodes[2].value = "true";
            var params = { allowScriptAccess: "always"};
            var atts = { id: current + "rep" };
            swfobject.embedSWF("http://www.youtube.com/v/" + this.childNodes[0].value + "?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1&autohide=1&modestbranding=0&iv_load_policy=3&rel=0&showinfo=0", 
                           current, "500", "300", "8", null, null, params, atts);
        
        }
        else{
            document.getElementById(current + "rep").style.display = "inline";
            ytplayer = document.getElementById(current + "rep");
            ytplayer.addEventListener("onStateChange", "onytplayerStateChange")
            //ytplayer.playVideo();
        }
    }
    else if(this.childNodes[3].value == "vimeo"){
        current = this.childNodes[1].value;
        current_gst = false;
        iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.childNodes[0].value);
        iframe.setAttribute("width", "500");
        iframe.setAttribute("height", "300");
        iframe.setAttribute("frameborder", "0");
        div = document.getElementById(this.childNodes[1].value);
        div.appendChild(iframe);
    }
	else if(this.childNodes[3].value == "audiofleet" || this.childNodes[3].value == "audio" ){
		current = this.childNodes[1].value;
		current_gst = false;
			html = '<object type="application/x-shockwave-flash" data="http://flash-mp3-player.net/medias/player_mp3_multi.swf" width="500" height="300">';
				html += '<param name="movie" value="http://flash-mp3-player.net/medias/player_mp3_multi.swf" />';
				html += '<param name="bgcolor" value="#ffffff" />';
				html += '<param name="FlashVars" value="mp3='+this.childNodes[0].value+'&amp;width=500&amp;height=300&amp;autoplay=1" />';
			html += '</object>';
		div = document.getElementById(this.childNodes[1].value).innerHTML = html;
	}
	else if(this.childNodes[3].value == "soundcloud"){
		current = this.childNodes[1].value;
		current_gst = false;
		html = '<object height="300" width="450"><param name="movie" value="https://player.soundcloud.com/player.swf?url='+this.childNodes[0].value+'&amp;color=0B61A4&amp;auto_play=true&amp;show_artwork=true&amp;show_playcount=true&amp;show_comments=true"></param><param name="allowscriptaccess" value="always"></param><embed allowscriptaccess="always" src="https://player.soundcloud.com/player.swf?url='+this.childNodes[0].value+'&amp;color=0B61A4&amp;auto_play=true&amp;show_artwork=true&amp;show_playcount=true&amp;show_comments=true" type="application/x-shockwave-flash" width="100%" height="81"></embed></object>';
		div = document.getElementById(this.childNodes[1].value).innerHTML = html;
	}
	else if(this.childNodes[3].value == "videofleet" || this.childNodes[3].value == "video" ){
		current = this.childNodes[1].value;
		current_gst = false;
		html = '<object width="500" height="300" type="application/x-shockwave-flash" data="/static/js/build/flashmediaelement.swf">'
			html += '<param name="movie" value="/static/js/build/flashmediaelement.swf" />'
			html += '<param name="flashvars" value="autoplay=true&controls=true&file='+ this.childNodes[0].value +'" />'
			html += '<img src="/static/images/night.png" width="450" height="300" title="No video playback capabilities" />'
		html += '</object>'
		div = document.getElementById(this.childNodes[1].value).innerHTML = html;
		$('audio,video').mediaelementplayer();
	}
}

window.onload = function (){
    var tag = document.getElementsByTagName('a');
    for(i=0; tag.length>i; i++){
        if(tag[i].className=="see_video") {
            m = addEvent(tag[i], 'click', alerta, false);
        }
        else if(tag[i].className=="get_by_genere"){
            n = addEvent(tag[i], 'click', get_by_genere, false);
        }
        else if(tag[i].className=="buttom_send_comment"){
            n = addEvent(tag[i], 'click', send_comments, false);
        }
		else if(tag[i].className=="add_collection") {
            m = addEvent(tag[i], 'click', mi_alerta, false);
        }
		else if(tag[i].className=="collecting") {
            m = addEvent(tag[i], 'click', mi_alerta_collect, false);
        }
    }
    
    set_state_block_feed();
}

//funcion para cargar los eventos a todos los videos
function onload_videos(){
    var tag = document.getElementsByTagName('a');
    for(i=0; tag.length>i; i++){
        if(tag[i].className=="see_video") {
            //elBody[i].addEventListener('click',alerta,true);
            m = addEvent(tag[i], 'click', alerta, false);
        }
        else if(tag[i].className=="buttom_send_comment"){
            n = addEvent(tag[i], 'click', send_comments, false);
        }
		else if(tag[i].className=="collecting") {
            m = addEvent(tag[i], 'click', mi_alerta_collect, false);
        }
    }

}

function onYouTubePlayerReady(playerId) {
      ytplayer = document.getElementById(current + "rep");
      ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

//añade un evento a cualquier objecto que sea pasado como parametro
function addEvent(elm, evType, fn, useCapture) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, useCapture);
		return true;
	}
	else if (elm.attachEvent) {
		var r = elm.attachEvent('on' + evType, fn);
		return r;
	}
	else {
		elm['on' + evType] = fn;
	}
}

//function toggle hace cambios en los bloques ocultando y mostrando objetos
function toggle(value){
    if(value){
        //$(current_block.parentNode).find(".hidden_foto_play").css("display", "none");
        $(current_block.parentNode).find(".buttom_close").css("display", "block");
        $(current_block.parentNode).find(".bar_rigth_collection").find(".see_video").css("display", "none");
    }
    else{
        //$(current_block.parentNode).find(".hidden_foto_play").css("display", "block");
        $(current_block.parentNode).find(".buttom_close").css("display", "none");
        $(current_block.parentNode).find(".bar_rigth_collection").find(".see_video").css("display", "block");

    }
}

//animacion que se ejecuta al pasar por encima un aimgen
function mouse_hover_image(){
    $(".see_video").hover(function(){
        value = $(this).find(".buttom_play");
        value_b = $(this).find(".decoration_ver");
        $(value).animate({"top": "10px"}, 500);
        $(value_b).animate({"top": "55px"}, 500);
    }, function(){
        value_b = $(this).find(".decoration_ver");
        value = $(this).find(".buttom_play");
        $(value).animate({"top": "-60px"}, 200);
        $(value_b).animate({"top": "140px"}, 200);
    });
}

//verifica el estado de el bloque de feed "block_feeds"
//si este no cuenta con un el tamaño adecuado sugue ejucanto peticiones.
function set_state_block_feed(){
    if($("#block_feed").height() < $(window).height()){
        request_ajaz();
    }
}

function add_pages(){
    var obj = document.getElementById("block_main");
    var current = document.getElementById("more_pages").value;
    if(current_request_pages != null){
    $.get(current_request_pages, function(data){
            current_request_pages = data.meta.next;
            var html = "";
			if(data.objects.length >= 4){
				$.each(data.objects, function(id, value){
					url = null;
					if(value.type == "youtube"){
						url = "/process/getorcreate/?gestor=youtube&url=" + value.urlplayer + "&name=" + value.name;
					}
					else if(value.type == "vimeo"){
						url = "/process/getorcreate/?gestor=vimeo&url=https://vimeo.com/" + value.video + "&name=" + value.name;
					}
					else if(value.type == "soundcloud"){
						url = "/process/getorcreate/?gestor=soundcloud&url="+value.video +"&name=" + value.name + "&foto="+value.foto;
					}
					else{
						url = "/page/" + value.id + "/" + value.path
					}
					
					html += "<div class='block_pages'>";
					html += "<a href='"+url+"' onclick='showLightbox2(true);' target='frame_pages'><img src='" + value.foto + "' width='100' alt='" + value.name + "image'></a>";
					html += "<div class='description_page'>";
					html += "<a href='"+url+"' onclick='showLightbox2(true);' target='frame_pages' class='name_page'>" + value.name + "</a><br>";
					html += "&nbsp;&nbsp;&nbsp;<span>visitas: " + value.visits + "</span>";
					//html += "<span><span class='icon-thumbs-up'></span>&nbsp;" + value.like + " </span>";
					//html += "<span><span class='icon-thumbs-up-2'></span>&nbsp;" + value.nolike + " </span><br>";
					html += '<input type="hidden" value="' + value.foto + '" class="data_foto">';
					html += '<input type="hidden" value="' + value.id + '" class="data_collection">';
					html += '<input type="hidden" value="' + value.name + '" class="data_name">';
					html += '&nbsp;&nbsp;&nbsp;<a class="collecting" value="yes">Coleccionar</a>';
					
					html += "</div></div>";
					
				});
			}
			else{
				return add_pages();
			}
            obj.innerHTML += html;
            onload_videos();
			document.getElementById("bloque_del_cargador").innerHTML = "";		
     });
	 }
	 else
	 {
		document.getElementById("bloque_del_cargador").innerHTML = "";
	 }
}

function search_process(){
//busquedas por palabra clave desde l buscador
	
	search = document.getElementById("search");
	if(gestor_busquedas == "fleet")
		current_request_pages = "/process/api/pages/?page=1&limit=8&search=" + search.value;
	else if(gestor_busquedas == "youtube")
		current_request_pages = "/process/api/pages/?limit=8&start_index=1&search_you=" + search.value;
	else if(gestor_busquedas == "vimeo")
		current_request_pages = "/process/api/pages/?limit=8&page=1&search_vi=" + search.value;
	else if(gestor_busquedas == "soundcloud")
		current_request_pages = "/process/api/pages/?limit=8&start_index=1&search_soundcl=" + search.value;
	document.getElementById("block_main").innerHTML = "";
	$("#bloque_del_cargador").html("<img src='/static/images/loader.gif' alt='cargador'>");
	add_pages();
	return false;
}

function save_visit(id_object){
	id = id_object.replace("div", "")
	if(document.getElementById("my_current_user")){
		datas = JSON.stringify({
			"user": "/api/v1/user/" + document.getElementById("my_current_user").value + "/",
			"collection": "/api/v1/collections/" + id + "/",
			"ip": "127.0.0.12"
		});
	}
	else{
		datas = JSON.stringify({
			"collection": "/api/v1/collections/" + id + "/",
			"ip": "127.0.0.12"
		});
	}
				
	$.ajax({
	type: "POST",
	url: "/api/v1/visit_collection/",
	contentType: 'application/json',
	dataType: 'json',
	data: datas,
	cache: false,
	});
}

function config_gestor(tipo, obj){
	gestor_busquedas = tipo;
		m = $(obj.parentNode).find("span");
		for(var i=0;m.length > i;i++){
			$(m[i]).css("background", "#39AECF");
		}
	obj.style.backgroundColor="red";
	document.getElementById("search").focus();
	
}
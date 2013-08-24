var array_reproductores = [];
var contador_reproductores = 0;
var f;
var button_play_all = true;

var index_by_id = {"uno": "tres"}


$(document).ready(function(){

    var tag = document.getElementsByTagName('a');
	contador_see = 0;
    for(x=0; tag.length>x; x++){
        if(tag[x].className=="see_video") {
            m = addEvent(tag[x], 'click', push_element, false);
			if(contador_see==0){
				var json = get_json($(tag[x]).find(".number_collection")[0].value);
			}
			contador_see++;
        }
    }
	
	$("select#select_name_collections").change(function(){
      //$("#selText").html($($(this).children("option:selected")[0]).text());
       var txt = $($(this).children("option:selected")[0]).text();
       $("#selText").html(txt);
    });
	
	txt = "1/" + array_reproductores.length
	$("#barra_herramientas .text").html(txt);

});

// window.onload = function (){
// }

function onload_comment(){
    var s = document.getElementById("buttom_send_comment_click");
    m = addEvent(s, 'click', send_comments, false);
}

function push_element(e){
    e.preventDefault();
	id = $(this).find(".number_collection")[0].value;
	contador_reproductores = index_by_id["collection_n" + id];
    var json = get_json(id);
	
	txt = (contador_reproductores + 1) + "/" + array_reproductores.length
	$("#barra_herramientas .text").html(txt);
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

function get_json(id){
    my_request = "/api/v1/collections/" + id + "/"
    $.ajax({
    type: "GET",
    url: my_request,
    //data: datas,
    cache: false,
    success: function(data){
		save_visit(id);
        alerta(data.video, data.body, data.urlaudio, data.urlvideo);
		load_info(data);
        print_in_window(data);
		document.getElementById("delete_value").setAttribute("aria-hidden", data.id);
    }
    });
}

function save_visit(id){
	datas = JSON.stringify({
		"user": "/api/v1/user/" + document.getElementById("my_current_user").value + "/",
		"collection": "/api/v1/collections/" + id + "/",
		"ip": "127.0.0.12"
	});
				
	$.ajax({
	type: "POST",
	url: "/api/v1/visit_collection/",
	contentType: 'application/json',
	dataType: 'json',
	data: datas,
	cache: false,
	});
}

current = false;
var current_gst = true;
function check(){
    if(current_gst){
        if(current){
            ytplayer.stopVideo();
            document.getElementById("block_expo").style.display = "none";
            current = false;
        }
    }
    else{
        document.getElementById("block_expo_meo").innerHTML = "";
    }
	document.getElementById("description_expo").innerHTML = "";
	document.getElementById("block_details").style.display = "none";
}

function alerta(video,body,urlaudio,urlvideo){
    check();
    
    if(body == "youtube"){
        current = true;
        current_gst = true;
        var params = { allowScriptAccess: "always"};
        var atts = { id: "block_expo" };
        swfobject.embedSWF("http://www.youtube.com/v/" + video + "?enablejsapi=1&playerapiid=ytplayer&autoplay=1&autohide=1&modestbranding=0&iv_load_policy=3&rel=0&showinfo=0", 
                       "block_expo", "600", "380", "8", null, null, params, atts);
        
    }
    else if(body == "vimeo"){
        current = true;
        current_gst = false;
        iframe = document.createElement("iframe");
        iframe.setAttribute("src", "http://player.vimeo.com/video/" + video + "/?badge=0&autoplay=1&api=1&player_id=player1meo");
        iframe.setAttribute("width", "630");
        iframe.setAttribute("height", "380");
		iframe.setAttribute("id", "player1meo");
        iframe.setAttribute("frameborder", "0");
        div = document.getElementById("block_expo_meo");
        div.appendChild(iframe);
        document.getElementById("block_expo_meo").style.display = "inline";
		
			var iframe = $('#player1meo')[0],
				player = $f(iframe),
				status = $('.status');

			// When the player is ready, add listeners for pause, finish, and playProgress
			player.addEvent('ready', function() {
				window.console.log('ready');
				
				//player.addEvent('pause', onPause);
				player.addEvent('finish', onFinish);
				//player.addEvent('playProgress', onPlayProgress);
			});


    }
	else if(body == "audio"){
		current = true;
        current_gst = false;
				// html = '<object type="application/x-shockwave-flash" data="http://flash-mp3-player.net/medias/player_mp3_multi.swf" width="500" height="300">';
					// html += '<param name="movie" value="http://flash-mp3-player.net/medias/player_mp3_multi.swf" />';
					// html += '<param name="bgcolor" value="#ffffff" />';
					// html += '<param name="FlashVars" value="mp3='+video+'&amp;width=500&amp;height=300&amp;autoplay=1" />';
				// html += '</object>';
			html = "<audio id='rep_audio_fleet' src='"+ video +"' autoplay='true' controls='controls' width='630' height='380'></audio>"
		div = document.getElementById("block_expo_meo").innerHTML = html;
		new MediaElement("rep_audio_fleet",{
			    success: function (mediaElement, domObject) { 
					// add event listener
					// mediaElement.addEventListener('timeupdate', function(e) {
						// window.console.log(mediaElement.currentTime);
					// }, false);
					
					mediaElement.addEventListener('ended', function(e) {
						window.console.log("finished");
						play_after();
					}, false);
					// call the play method
					mediaElement.play();
				},
				// fires when a problem is detected
				error: function () { 
				 
				}
		});
	}
	else if(body == "soundcloud"){
		current = true;
        current_gst = false;
		//html = '<object height="300" width="450" id="myPlayer"><param name="movie" value="https://player.soundcloud.com/player.swf?url='+video+'&amp;color=0B61A4&amp;auto_play=true&amp;show_artwork=true&amp;show_playcount=true&amp;show_comments=true&object_id=myPlayer&enable_api=true"></param><param name="allowscriptaccess" value="always"></param><embed allowscriptaccess="always" src="https://player.soundcloud.com/player.swf?url='+video+'&amp;color=0B61A4&amp;auto_play=true&amp;show_artwork=true&amp;show_playcount=true&amp;show_comments=true&object_id=myPlayer&enable_api=true" type="application/x-shockwave-flash" width="100%" height="81" name="myPlayer"></embed></object>';
		
		html= '<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url='+video+'&auto_play=true" width="630" height="380" scrolling="no" frameborder="no"></iframe>';
		$("#block_expo_meo").html(html);
		load_soundcloud();
		
		
	}
	else if(body == "audiofleet"){
		current = true;
        current_gst = false;
				// html = '<object type="application/x-shockwave-flash" data="http://flash-mp3-player.net/medias/player_mp3_multi.swf" width="500" height="300">';
					// html += '<param name="movie" value="http://flash-mp3-player.net/medias/player_mp3_multi.swf" />';
					// html += '<param name="bgcolor" value="#ffffff" />';
					// html += '<param name="FlashVars" value="mp3=/media/'+urlaudio+'&amp;width=500&amp;height=300&amp;autoplay=1" />';
				// html += '</object>';
			
		html = "<audio id='rep_audio_fleet' src='/media/"+urlaudio+"' autoplay='true' width='630' height='380' controls='controls'></audio>"
		div = document.getElementById("block_expo_meo").innerHTML = html;
		new MediaElement("rep_audio_fleet",{
			    success: function (mediaElement, domObject) { 
					// add event listener
					// mediaElement.addEventListener('timeupdate', function(e) {
						// window.console.log(mediaElement.currentTime);
					// }, false);
					
					mediaElement.addEventListener('ended', function(e) {
						window.console.log("finished");
						play_after();
					}, false);
					// call the play method
					mediaElement.play();
				},
				// fires when a problem is detected
				error: function () { 
				 
				}
		});
	}
	else if(body == "videofleet"){
		current = true;
        current_gst = false;
		html = '<video src="/media/'+ urlvideo +'" id="rep_video_fleet" width="630" height="380" controls="controls"></video>';
		div = $("#block_expo_meo").html(html);
		new MediaElement("rep_video_fleet",{
			    success: function (mediaElement, domObject) { 
					// add event listener
					// mediaElement.addEventListener('timeupdate', function(e) {
						// window.console.log(mediaElement.currentTime);
					// }, false);
					
					mediaElement.addEventListener('ended', function(e) {
						window.console.log("finished");
						play_after();
					}, false);
					// call the play method
					mediaElement.play();
				},
				// fires when a problem is detected
				error: function () { 
				 
				}
		});
	}
}

function print_in_window(json){
        var pr_comments = json.main_comments;
        html = "";
        //layer comentarios
        html += '<div class="layer_comentarios">';
        html += '<div><span class="chain icon-bubble">&nbsp;&nbsp;Comentarios</span><br>';
        html += '<img src="'+img_user+'" width="50px" class="image_comment">&nbsp;&nbsp;&nbsp;'; 
        html += '<textarea class="comment" maxlength="600" required placeholder="Comentario"></textarea>';
        html += '<input type="hidden" value="' + json.id + '" class="hidden_comment"><br /><br />';
        html += '<a class="buttom_send_comment" id="buttom_send_comment_click">submit</a></div>';
        html += '<div class="block_comments">';
    for(var z=0;pr_comments.objecto.length>z;z++){
        html += '<div class="unt_comment">';
        html += '<div class="block_image_comment">';
        if(pr_comments.objecto[z].imagen){
            html += '<img src="' + pr_comments.objecto[z].imagen + '" width="50px"></div>';
        }
        else{
            html += '<img src="/static/images/sinimagen.png" width="50px"></div>';
        }
        html += '<div class="block_description_comments">';
        if(pr_comments.objecto[z].name){
            html += '<span class="autor">' + pr_comments.objecto[z].name + ' </span> - <span class="fecha">' + pr_comments.objecto[z].date + ' </span></div>';
        }
        else{
            html += '<span class="autor">Desconocido </span> - <span class="fecha">' + pr_comments.objecto[z].date + ' </span></div>';
        }
        
            html += '<div class="block_qualify_comments">';
            if(pr_comments.objecto[z].on_like == "likeno"){
                html += '<div onclick="send_qualify_comment(this, false, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments" style="color:#35C0CD;"><span class="icon-thumbs-up-2">&nbsp;&nbsp;</span><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[1] + '</div>';
                html += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                html += '<div onclick="send_qualify_comment(this, false, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments"><span class="icon-thumbs-up-2">&nbsp;&nbsp;</span><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[1] + '</div>';
                html += '<input type="hidden" value="true" class="state_like"></div>';
            }
            
            if(pr_comments.objecto[z].on_like == "like"){
                html += '<div onclick="send_qualify_comment(this, true, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments" style="color:#35C0CD;"><span class="icon-thumbs-up">&nbsp;&nbsp;</span><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[0] + '</div>';
                html += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                html += '<div onclick="send_qualify_comment(this, true, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments"><span class="icon-thumbs-up">&nbsp;&nbsp;</span><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[0] + '</div>';
                html += '<input type="hidden" value="true" class="state_like"></div>';
            }
            
            html += "</div><br>";
            

        html += '<div class="block_content_comment">';
        html += '<span>' + pr_comments.objecto[z].comment + '</span></div>';
        html += '<div class="cleaner" ></div>'
        
        html += "</div>";
    }
    if(pr_comments.value){
        html += '<div class="button_get_more_comments" onclick="get_more_comments(this);">+ commentarios';
        html += '<input type="hidden" class="comments_data_url" value="' + pr_comments.url + '"></div>';
    }
    
    html += "</div></div>";
    
    document.getElementById("description_expo").innerHTML = html;
	document.getElementById("block_details").style.display = "block";
    //$(document).scrollTop(0);
	onload_comment();
}

function onytplayerStateChange(event) {
       switch(event) {
        case 0:
            window.console.log('Video has ended.');
			play_after();
			var json = get_json(m);
            break;
        case 1:
            window.console.log('Video is playing.');
            break;
        case 2:
            window.console.log('Video is paused.');
            break;
        case 3:
            window.console.log('Video is buffering.');
            break;
        case 4:
            window.console.log('Video is cued.');
            break;
        default:
            window.console.log('Unrecognized state.');
            break;
    }
}

function onYouTubePlayerReady(playerId) {
      ytplayer = document.getElementById("block_expo");
      ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

function delete_collection(obj)
{
	m = confirm("esta seguro que desea eliminar este archivo de la coleccion")
	if(m){
		id = obj.getAttribute("aria-hidden");
		$.ajax({
			type:"DELETE",
			url:"/api/v1/collections/"+id+"/",
			success:function(){
				$("#collection_n" + id).hide(300);
				
				var json = get_json($("a.see_video:first").find(".number_collection")[0].value);
				numero_collection = $("#collection_n" + id).parent().find(".icon-folder-open b").html();
				$("#collection_n" + id).parent().find(".icon-folder-open b").html(numero_collection - 1);
				//location.href = location.href ;
			}
		});
	}
}

function delete_name_collection(obj)
{
	m = confirm("esta seguro que desea eliminar esta colección perdera todo su contenido")
	if(m){
		id = obj.getAttribute("aria-hidden");
		$.ajax({
			type:"DELETE",
			url:"/api/v1/namecollections/"+id+"/",
			success:function(){
				$("#name_collection_" + id).hide(300);
				
				var json = get_json($("a.see_video:first").find(".number_collection")[0].value);
			}
		});
	}
}



function send_edite_collection()
{
	id = document.getElementById("delete_value").getAttribute("aria-hidden");
	name_collection = document.getElementById("select_name_collections");
	var data = JSON.stringify({
			"name": document.getElementById("edit_name").value,
			"namecollection": "/api/v1/namecollections/"+name_collection.value+"/",
			"comment": document.getElementById("edit_comment").value,
			});
	
	$.ajax({
		type:"PUT",
		url:"/api/v1/collections/"+id+"/",
		  contentType: 'application/json',
		  data: data,
		  dataType: 'json',
		  processData: false,
		success:function(){
			location.href = location.href ;
			/*var json = get_json($("#collection_n" + id).find(".number_collection")[0].value);
			$("#collection_n" + id).find(".text")[0].innerHTML = document.getElementById("edit_name").value;
			current = $("#collection_n" + id).clone().hide();
			//$("#collection_n" + id).remove();
			$("#collection_n" + id).hide("slow", function(){$(this).remove()});

			if(document.getElementById("name_collection_"+name_collection.value)){
				$($("#name_collection_"+name_collection.value).find(".content_all_carpets")[0]).prepend(current);
				current.show("normal");
			}
			else{
				name_text = getSelectedText("select_name_collections");
				html = '<div class="block_collection" id="name_collection_'+name_collection.value+'">';
					html += '<span>';
						html += '<span class="icon-tree"><b style="font-size:1.2em;font-family:trebuchet ms, arial">&nbsp;&nbsp;'+name_text+'</b></span>';
						html += '<br /><hr /><br />';
					html += '</span>';
						html += '<div>';

						html += '</div>';
						
						html += '<br />';
						html += '<span class="icon-folder-open">&nbsp;&nbsp;Total: <span><b>1</b></span></span>';
				html += '</div>';
				$("#total_collections").prepend(html);
				
				$($("#name_collection_"+name_collection.value).find("div")[0]).prepend(current).show("normal");
			}*/
		}
	});
}

function edite_collection(obj)
{
	//alert("Editado" + obj.getAttribute("aria-hidden"));
	//object.getAttribute("aria-hidden");
	$("#block_details span").css("color", "gray");
	obj.style.color = "#39AECF";
	document.getElementById("info_expo").style.display = "none";
	document.getElementById("description_expo").style.display = "none";
	document.getElementById("edit_expo").style.display = "block";
}

function info_collection(obj)
{
	$("#block_details span").css("color", "gray");
	obj.style.color = "#39AECF";
	document.getElementById("info_expo").style.display = "block";
	document.getElementById("description_expo").style.display = "none";
	document.getElementById("edit_expo").style.display = "none";
}

function comment_collection(obj)
{
	$("#block_details span").css("color", "gray");
	obj.style.color = "#39AECF";
	document.getElementById("info_expo").style.display = "none";
	document.getElementById("description_expo").style.display = "block";
	document.getElementById("edit_expo").style.display = "none";
}

function load_info(data)
{
	html = "";
	if(data.foto == ""){
		html += "<img src='/static/images/video.png' height='100'/><br /><br />";
	}
	else{
		html += "<img src='"+ data.foto +"' /><br /><br />";
	}
	
	html +="<table width='100%' cellspacing='0'>";
		html +="<tr>";
			html +="<td width='40%' class='first'><b>Nombre: </b></td>";
			html +="<td width='60%'>"+data.name+"</td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first'><b>Visitas: </b></td>";
			html +="<td>"+data.visits+"</td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first'><b>Tipo: </b></td>";
			html +="<td>"+data.body+"</td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first'><b>Nombre colección: </b></td>";
			html +="<td>"+data.belong_to[0]+"</td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first'><b>Numero: </b></td>";
			html +="<td>"+data.id+"</td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first'><b>Fecha: </b></td>";
			html +="<td>"+data.fecha+"</td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first' colspan='2'><b>Haz tu Votación </b></td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td><span class='icon-thumbs-up'>&nbsp;&nbsp;"+data.number_likes+"</span></td>";
			html +="<td><span class='icon-thumbs-up-2'>&nbsp;&nbsp;"+data.number_nolikes+"</span></td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td class='first' colspan='2'><b>Comentario del autor</b></td>";
		html +="</tr>";
		html +="<tr>";
			html +="<td colspan='2'>"+data.comment+"</td>";
		html +="</tr>";
	html +="</table>";
	document.getElementById("info_expo_content").innerHTML = html;
	
	
	//bloque editar
	document.getElementById("edit_name").value = data.name;
	document.getElementById("option_" + data.belong_to[1]).selected = true;
	document.getElementById("edit_comment").value = data.comment;
}

//devuelve el valor de el texto de un select de la opcion seleccionada
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

function add_namecollection(){
    //añadir nombre de coleccion
    name = document.getElementById("add_collection_form").value;
	user = document.getElementById("my_current_user").value;
    var data = JSON.stringify({
    "user": "/api/v1/user/" + user + "/",
    "name": name,
    });
    $.ajax({
        type:"POST",
        url:"/api/v1/namecollections/",
        contentType: 'application/json',
        data: data,
        dataType: 'json',
        processData: false
    }).done(function(response) { 
		id_name = get_collections(name);
    });
    
}

function get_collections(name_collection){
    //obtener todas las colecciones de dicho usuario
	user = document.getElementById("my_current_user").value;
    $.get("/api/v1/namecollections/?limit=100&user=" + user, function(data){
        var html = "<select size='4' id='select_name_collections'>";
        for(var i=0;i<data['objects'].length;i++){
            if(data['objects'][i]['name'] == name_collection){
            html += "<option selected value='" + data['objects'][i]['id'] + "'>" + data['objects'][i]['name'] + "</option>";
			id_name = data['objects'][i]['id'];
            }
            else{
             html += "<option value='" + data['objects'][i]['id'] + "'>" + data['objects'][i]['name'] + "</option>";
            }
        }
        html += "</select>";
        $("#select_collection").html(html);
		

				html = '<div class="block_collection" id="name_collection_'+id_name+'">';
					html += '<span>';
						html += '<span class="icon-tree"><b style="font-size:1.2em;font-family:trebuchet ms, arial">&nbsp;&nbsp;'+name+'</b></span>';
						html += '<br /><hr /><br />';
					html += '</span>';
						html += '<div>';

						html += '</div>';
						
						html += '<br />';
						html += '<span class="icon-folder-open">&nbsp;&nbsp;Total: <span><b>0</b></span></span>';
				html += '</div>';
				$("#total_collections").prepend(html);
				$("html, body").animate({ scrollTop: "0px" }, "slow");
				
    });
	
	
} 

function crear_name_collection(){
	edite_collection();
	$("#edit_expo > div").animate({ scrollTop: "200px" });
	$(".block_mas").css({ "background-color": "#3AAACF" });
	$(".block_mas").animate({ "background-color": "#ebebeb" }, 2000);
}

//funciones de vimeo

function onPause() {
    window.console.log('paused');
}

function onFinish() {
    window.console.log('finished');
	play_after();
}

function onPlayProgress(data) {
    window.console.log(data.seconds + 's played');
}

function load_soundcloud(){

    var widgetIframe = document.getElementById('sc-widget'),
        widget       = SC.Widget(widgetIframe);

    widget.bind(SC.Widget.Events.READY, function() {
      widget.bind(SC.Widget.Events.PLAY, function() {
		window.console.log("inicio");
      });
 
       widget.bind(SC.Widget.Events.FINISH, function() {
            window.console.log('finished');
			play_after();
      });
	  
    });

}

function play_before(){
	 $('#collection_n' + array_reproductores[contador_reproductores]).css({"background-color": "#000"});
	if((contador_reproductores - 1) != -1)
	{
		contador_reproductores -= 1;
		m = array_reproductores[contador_reproductores];
		var json = get_json(m);
	}
	else{
		contador_reproductores = (array_reproductores.length - 1);
		m = array_reproductores[contador_reproductores];
		var json = get_json(m);
	}
	
	$('html, body').animate({
         scrollTop: $('#collection_n' + array_reproductores[contador_reproductores]).offset().top
     }, 1000);

	 $('#collection_n' + array_reproductores[contador_reproductores]).css({"background-color": "#39AECF"});
	 
	txt = (contador_reproductores + 1) + "/" + array_reproductores.length
	$("#barra_herramientas .text").html(txt);
}

function play_after(){
	if(button_play_all){
		$('#collection_n' + array_reproductores[contador_reproductores]).css({"background-color": "#000"});
		if((contador_reproductores + 1) != array_reproductores.length)
		{
			contador_reproductores += 1;
			m = array_reproductores[contador_reproductores];
			var json = get_json(m);
			

		}
		else{
			contador_reproductores = 0;
			m = array_reproductores[contador_reproductores];
			var json = get_json(m);
		}
		
		$('html, body').animate({
			 scrollTop: $('#collection_n' + array_reproductores[contador_reproductores]).offset().top
		 }, 1000);
		 
		 $('#collection_n' + array_reproductores[contador_reproductores]).css("background-color", "#39AECF");
		 
		txt = (contador_reproductores + 1) + "/" + array_reproductores.length
		$("#barra_herramientas .text").html(txt);
	}
}

//funcion para autorizr reproducir todo el contenido.
function toggle_play_all(){
	if(button_play_all){
		button_play_all = false;
		$("#main_expo #barra_herramientas .icon-loop").css("color", "gray");
	}
	else{
		button_play_all = true;
		$("#main_expo #barra_herramientas .icon-loop").css("color", "#39AECF");
	}
}

//oculta todas las colleciones  de un bloque en especifico
function toggle_hidden_collections(obj){
	m = obj.parentNode.parentNode.parentNode;
	m = $(m).find(".content_all_carpets")[0];
	$(m).slideToggle();
	if(obj.innerHTML == "&nbsp;&nbsp;Ocultar")
	{obj.innerHTML = "&nbsp;&nbsp;Mostrar"}
	else
	{obj.innerHTML = "&nbsp;&nbsp;Ocultar"}
}
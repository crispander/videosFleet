function f_clientWidth() {
	return f_filterResults (
		window.innerWidth ? window.innerWidth : 0,
		document.documentElement ? document.documentElement.clientWidth : 0,
		document.body ? document.body.clientWidth : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

var publicity_action = true;
$(window).scroll(function () {
	m = $(window).height() + $(window).scrollTop()
	window.console.log(m);
	if(m >= 1200){
		if(publicity_action){
			$("#avanced").css({'position': 'fixed', 'z-index': 1, 'top': '0', 'left': '826px', 'padding': '0 10px', 'border': '1px soli gray'});
			publicity_action = false;
		}
	}
	else if(publicity_action == false && m < 1200){
		$("#avanced").css({'position': 'static', 'padding': '0', 'border': 'none'});
			publicity_action = true;
	}
	
	if(m >= 700){
		$("#contenedor_de_videos").css({'top': '0'});
	}
	else{
		$("#contenedor_de_videos").css({'top': '50px'});
	}
    if(current_request)
    {
        //console.log(" window = " + $(window).height() + " scroll = " + $(window).scrollTop() + " document = " + $(document).height() + " suma = " + ($(window).height() + $(window).scrollTop()));
        //console.log(" window = " + $(window).height() + " scroll = " + $(window).scrollTop() + " document = " + $(document).height() + " suma = " + ($(window).height() + $(window).scrollTop()));
		
		if (m >= $(document).height() - 10) {
            request_ajaz();
        }
    }
});


function print_in_window(data){
    //asignar el nuevo dato de laproxima pagina
        current_request = data.meta.next;
        
        var html = "";
        var object = data.objects;
        
        if(data.meta.type == "feed"){
            for(var x=0;object.length>x;x++){
               //filtro para averiguar si el usuario y sus colleciones ya fueron escritas en la ventana
                if(document.getElementById(object[x]['id'])){
                    null
                }
                else if(object[x]['feed_collection'].length == 0){
                    null
                }
                else{
					html += '<div class="top_colection_data_user">';
					html += '<table width="100%" cellspacing="0">';
						html += '<tr>';
						html += '<td rowspan="2">';
							if(object[x]['imagen']){
								html += '<a href="/home/feed/' + object[x]['id'] + '/" class="button_image_start"><img src="' + object[x]['imagen'] + '" width="50px" alt="{{ i.first_name }}"></a> ';
							}
							else{
								html += '<a href="/home/feed/' + object[x]['id'] + '/" class="button_image_start"><img src="/static/images/sinimagen.png" width="50px" alt="{{ i.first_name }}"></a> ';
							}
						html += '</td>';
						html += '<td>';
							html += object[x]['user'];
						html += '</td>';
						html += '<td>';
							html += 'Seguidores: ' + object[x]['number_follows'];
						html += '</td>';
						html += '<td>';
							html += 'Genero: Trance';
						html += '</td>';
						html += '</tr>';

						html += '<tr>';
						html += '<td>';

						
						name_user = object[x]['user'];
                        if(object[x]['on_follow'] == "no_registred"){
                            html += '<a class="follow_me" href="/process/login_form/">Seguir</a>';
                        }
                        else if(object[x]['on_follow']){
                            var my_current_user = document.getElementById("my_current_user").value;
                            if (my_current_user != object[x]['id']){
                                html += ' <button class="follow_me" onclick="on_suscription_toggle(this, ' + object[x]['on_follow'] + ', false)">Siguiendo</button> ';
                            }
                        }
                        else{
                            var my_current_user = document.getElementById("my_current_user").value;
                            if (my_current_user != object[x]['id']){
                                html += ' <button class="follow_me" onclick="on_suscription_toggle(this, ' + my_current_user + ', ' + object[x]['id'] + ')">Seguir</button> ';
                            }
                        }
						
						html += '</td>';
						html += '<td>';
							html += ' <div class="div_data_number_followers"> ' + object[x]["number_follows"] + '</div>';
						html += '</td>';
						html += '<td>';
							html += 'Puntos: 1204';
						html += '</td>';
					html += '</tr>';
					html += '</table>';
					html += '</div>';
			
                    html += '<input type="hidden" id="' + object[x]['id'] + '">';
                    html += print_collection(object[x]['feed_collection']);
                }
            }
        }
        else if(data.meta.type == "collection"){
            html += print_collection(object);
        }
        $("#block_feed").append(html);
        onload_videos();
        mouse_hover_image();

}


function request_ajaz(){
    if(current_request){
        $.ajax({
        type: "GET",
        url: current_request,
        //data: datas,
        cache: false,
        success: function(data){
            print_in_window(data);
            set_state_block_feed();
        }
        });
    }
}

function get_by_genere(event){
    event.preventDefault();
    type = this.firstChild;
	$("#avanced a").css("border-color", "gray");
	this.style.borderColor= "#175275";
    block_main = document.getElementById("block_feed");
    check();
    block_main.innerHTML = "<img src='/static/images/loader.gif' alt='cargador'>";
    
    if(current_page){
        var request_current_genere = "/home/super/api/"+ current_page + "/?limit=3&page=1&type_music=" + type.value
    }
    else{
        var request_current_genere = "/home/super/api/none/?limit=3&page=1&type_music=" + type.value
    }

    $.ajax({
        type: "GET",
        url: request_current_genere,
        //data: datas,
        cache: false,
        success: function(data){
			block_main.innerHTML = "";
            print_in_window(data);
            set_state_block_feed();
    }
});
}

function search_by_genere(){
    type = document.getElementById("search_genere");
    block_main = document.getElementById("block_feed");
    check();
    block_main.innerHTML = "<img src='/static/images/loader.gif' alt='cargador'>";
    
    if(current_page){
        var request_current_genere = "/home/super/api/"+ current_page + "/?limit=3&page=1&type_music=" + type.value
    }
    else{
        var request_current_genere = "/home/super/api/none/?limit=3&page=1&type_music=" + type.value
    }

    $.ajax({
        type: "GET",
        url: request_current_genere,
        //data: datas,
        cache: false,
        success: function(data){
			block_main.innerHTML = "";
            print_in_window(data);
            set_state_block_feed();
    }
});
}

function print_collection(json, name_user){
    var html = "";
    for(var i=0;json.length>i;i++){
    html += "<div class='block_collection'>";
    html += "<div class='header_feed'><span>" + json[i].name + "</span></div>";
        html += '<div class="bar_rigth_collection">';
        html += '<a class="buttom_close" onclick="check();"></a>';
                if(json[i].body == "vimeo")
                    html += '<a class="see_video" href="/"><input type="hidden" value="http://player.vimeo.com/video/' + json[i].video + '?badge=0&autoplay=1"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="vimeo"></a>';
                else if(json[i].body == "youtube")
                    html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].video + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="youtube"></a>';
				else if(json[i].body == "videofleet")
                    html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].urlvideo + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="videofleet"></a>';
				else if(json[i].body == "audiofleet")
                    html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].urlaudio + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="audiofleet"></a>';
				else if(json[i].body == "audio")
                    html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].video + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="audio"></a>';
        html += '<a class="go_to_collection" href="/home/desc_collection/' + json[i].id + '" onclick="showLightbox2();" target="frame_pages"></a>';
        html += '<a class="collecting"></a>';
		html += '<input type="hidden" value="'+json[i].foto+'" class="data_foto">';
		html += '<input type="hidden" value="' + json[i].id + '" class="data_collection">';
		html += '<input type="hidden" value="' + json[i].name + '" class="data_name">';
        html += '</div>';

    
    html += "<div id='div" + json[i].id + "' ></div>";
    html += "<div class='hidden_foto_play'>";
	if(json[i].foto){
		foto = json[i].foto;
	}
	else{
		foto = "/static/images/video.png";
	}
    if(json[i].body == "vimeo")
        html += "<a class='see_video' href='/'><input type='hidden' value='http://player.vimeo.com/video/" + json[i].video + "?badge=0&autoplay=1'><input type='hidden' value='div" + json[i].id + "'><input type='hidden' value='false' class='cl_state'><input type='hidden' value='vimeo'><img height='100' src='" + foto + "'><div class='buttom_play'></div><p class='decoration_ver'>ver</p></a>";
    else if(json[i].body == "youtube")
        html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].video + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="youtube"><img height="100" src="' + foto + '"><div class="buttom_play"></div><p class="decoration_ver">ver</p></a>';
    else if(json[i].body == "videofleet")
        html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].urlvideo + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="videofleet"><img height="100" src="' + foto + '"><div class="buttom_play"></div><p class="decoration_ver">ver</p></a>';
	else if(json[i].body == "audiofleet")
        html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].urlaudio + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="audiofleet"><img height="100" src="' + foto + '"><div class="buttom_play"></div><p class="decoration_ver">ver</p></a>';
	else if(json[i].body == "audio")
        html += '<a class="see_video" href="/"><input type="hidden" value="' + json[i].video + '"><input type="hidden" value="div' + json[i].id + '"><input type="hidden" value="false" class="cl_state"><input type="hidden" value="audio"><img height="100" src="' + foto + '"><div class="buttom_play"></div><p class="decoration_ver">ver</p></a>';
    
	html += '<div class="description_feed"> <i>';
        html += "<span class='pastilla'><span class='pastilla_left'><span class='icon-home'>&nbsp;&nbsp;</span> Visitas: </span> <span class='pastilla_right'>" + json[i].visits + "</span></span>";
        html += "<span class='pastilla'><span class='pastilla_left'><span class='icon-user'>&nbsp;&nbsp;</span> Autor: </span> <span class='pastilla_right'>" + json[i].author + "</span></span>";
		html += "<span class='pastilla'><span class='pastilla_left'><span class='icon-globe'>&nbsp;&nbsp;</span> Tipo: </span> <span class='pastilla_right'>" + json[i].body + "</span></span>";
		html += '<span class="pastilla"><span class="pastilla_left"><span class="icon-thumbs-up">&nbsp;&nbsp;</span>like:</span> <span class="pastilla_right"> ' + json[i].number_likes + '</span></span>';
		html += '<span class="pastilla"><span class="pastilla_left"><span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>No like:</span> <span class="pastilla_right"> ' + json[i].number_nolikes + '</span></span>';
    html += " </i> </div>";
    html += '<div class="cleaner"></div>';
    html += "</div>";

    html += "<div class='footer_feed'>";
    if(json[i].comment)
        html += "<span>" + json[i].comment + "</span>";
    html += "</div>";
    
    html += '<div class="tools_bar">';
        if(json[i].on_like == "like"){
            html += "<div onclick='on_like_toggle(this, true, " + json[i].id + ");' class='buttoms_of_quals' style='color:#35C0CD;'>";
            html += '<span class="icon-thumbs-up">&nbsp;&nbsp;</span>';
            html +=  '<input type="hidden" value="false" class="state_like" ></div> ';
        }
        else{
            html += "<div onclick='on_like_toggle(this, true, " + json[i].id + ");' class='buttoms_of_quals'>"
            html += '<span class="icon-thumbs-up">&nbsp;&nbsp;</span>';
            html +=  '<input type="hidden" value="true" class="state_like" ></div> ';
        }
        
        if(json[i].on_like == "likeno"){
            html += "<div onclick='on_like_toggle(this, false, " + json[i].id + ");' class='buttoms_of_quals' style='color:#35C0CD;'>";
            html += '<span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>';
            html +=  '<input type="hidden" value="false" class="state_like" ></div> ';
        }
        else{
            html += "<div onclick='on_like_toggle(this, false, " + json[i].id + ");' class='buttoms_of_quals'>";
            html += '<span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>';
            html +=  '<input type="hidden" value="true" class="state_like" ></div> ';
        }
    html += "</div>";
    //layer comentarios

        html += '<div class="layer_comentarios">';
        html += '<div><span class="chain">Comentarios</span><br>';
        html += '<img src="' + document.getElementById("my_current_image").value + '" width="50px" class="image_comment"> '; 
        html += ' <textarea class="comment" maxlength="600" required placeholder="Comentario"></textarea>';
        html += '<input type="hidden" value="' + json[i].id + '" class="hidden_comment"> ';
        html += ' <a class="buttom_send_comment">submit</a></div>';
        html += '<div class="block_comments">';
    var pr_comments = json[i].main_comments
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
        
		html += '<br><div class="block_content_comment">';
        html += '<span>' + pr_comments.objecto[z].comment + '</span></div>';
        html += '<div class="cleaner" ></div>'
		
		
            html += '<div class="block_qualify_comments">';
			
			if(pr_comments.objecto[z].on_like == "likeno"){
                html += '<div onclick="send_qualify_comment(this, false, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments" style="color:#35C0CD;" ><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[1] + '</div>';
                html += '<span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>';
                html += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                html += '<div onclick="send_qualify_comment(this, false, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[1] + '</div>';
                html += '<span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>';
                html += '<input type="hidden" value="true" class="state_like"></div>';
            }
			
            if(pr_comments.objecto[z].on_like == "like"){
                html += '<div onclick="send_qualify_comment(this, true, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments" style="color:#35C0CD;"><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[0] + '</div>';
                html += '<span class="icon-thumbs-up">&nbsp;&nbsp;</span>';
                html += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                html += '<div onclick="send_qualify_comment(this, true, ' + pr_comments.objecto[z].id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">' + pr_comments.objecto[z].raiting[0] + '</div>';
                html += '<span class="icon-thumbs-up">&nbsp;&nbsp;</span>';
                html += '<input type="hidden" value="true" class="state_like"></div>';
            }
            
            
            html += "</div>";
        
        html += "</div>";
    }
    //boton mas commentarios
    if(pr_comments.value){
        html += '<div class="button_get_more_comments" onclick="get_more_comments(this);">+ commentarios';
        html += '<input type="hidden" class="comments_data_url" value="' + pr_comments.url + '"></div>';
    }
    html += "</div></div>";
    //
    html += "</div>";
}
    //$('body').jScrollPane({showArrows: true});
    return html
}


function showLightbox2(cerrar) {
    //mostrar el lightbox
	if(cerrar)
		check();

	document.getElementById('over2').style.display='block';
	document.getElementById('fade2').style.display='block';
	document.getElementsByTagName('body')[0].style.overflow="hidden";
}
function hideLightbox2() {
    //ocultar el lightbox
	document.getElementById("frame_feed").src = "/loader/";
    document.getElementById('over2').style.display='none';
    document.getElementById('fade2').style.display='none';
    document.getElementsByTagName('body')[0].style.overflow="auto";
}
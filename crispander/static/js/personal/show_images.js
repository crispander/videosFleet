contador = 0;
numero_Actual = 0;
array_images = new Array();
var position = 0;

var widthimg;
var heightimg;
var image_select;

var x1 = null;
var y1 = null;
var x2 = null;
var y2 = null;

$(document).ready(function(){
	$("#loader").css("display", "block");
	siguiente();
});

function load_buttons_comments(){
    var tag = document.getElementsByTagName('a');
    for(i=0; tag.length>i; i++){

        if(tag[i].className=="buttom_send_comment"){
            n = addEvent(tag[i], 'click', send_comments, false);
        }
    }
}


function atras(){
   if(before){
	  alert(3333333);
   }
}

function siguiente(){
   if(after){
	  $.ajax({
		type: "GET",
		url: url_after,
		contentType: 'application/json',
		dataType: 'json',
		cache: false,
		success: function(data){
			numero_Actual = data.objects.length;
			url_after = data.meta.next;
			if(data.meta.next){
				after = true;
			}
			else{
			   after = false;
			}
			$.each(data.objects, function(key, value){     
				array_images.push([value.imagen, value.id]);
			});
			
			if(array_images.length == 0){
				html = "En el momento no hay imagenes por mostrar.";
				$("#content_images").append(html);
				$("#loader").css("display", "none");
			}
			else{
			    printImages();
			}
		}
     });
	 return true;
  }
  else{
	$("#loader").css("display", "none");
	return null;
  }
}

function printImages(){
	html = "";
	for(i=0;i<numero_Actual;i++) {
		html += '<div class="bloque_unidad" id="unidad_image_n'+ array_images[contador][1] +'">';
			html += '<div class="unidad" onclick="mostrar('+ contador +');">';
				html += '<img src="'+ array_images[contador][0] +'" align="middle">';
			html += '</div>';
			//edicion de imagenes
			html += '<div class="subunidad">';
			if(is_supersuser){
				html += '<span class="icon-cancel-circle" onclick="delete_image('+array_images[contador][1]+', '+contador+')">&nbsp;Eliminar</span>&nbsp;&nbsp;&nbsp;<span onclick="set_image_user('+contador+')" class="icon-user">&nbsp;Imagen perfil</span>';
			}
			else{
				html += '<span>&nbsp;</span>';	
			}
			html += '&nbsp;&nbsp;&nbsp;<span onclick="mostrar('+ contador +');" class="icon-picture">&nbsp;&nbsp;Ver</span>';
			html += '</div>';
		html += '</div>';
		contador++;
	}
	
	$("#content_images").append(html);
	$("#loader").css("display", "none");
}

$(window).scroll(function () {
	m = $(window).height() + $(window).scrollTop()
        //console.log(" window = " + $(window).height() + " scroll = " + $(window).scrollTop() + " document = " + $(document).height() + " suma = " + ($(window).height() + $(window).scrollTop()));
        //console.log(" window = " + $(window).height() + " scroll = " + $(window).scrollTop() + " document = " + $(document).height() + " suma = " + ($(window).height() + $(window).scrollTop()));
		if (m >= $(document).height() - 10) {
			$("#loader").css("display", "block");
            siguiente();
        }
});

function mostrar(cur) {
	showLightbox2();
	position = cur;
	img = "<img src='" + array_images[position][0] + "' id='image_main'>";
	$("#main").html(img);
	print_comment();
}

function mas() {
	if(array_images.length > position + 1) 
	{
		position += 1;
		img = "<img src='" + array_images[position][0] + "' id='image_main'>";
		$("#main").html(img);
		print_comment();
	}
	else if(after){
		if(siguiente()){
			position += 1;
			if(array_images[position] != null){
				img = "<img src='" + array_images[position][0] + "' id='image_main'>";
			}
			else{
				img = "<img src='static/images/audio.png' id='image_main'>";
			}
			$("#main").html(img);
			print_comment();
		}
	}
}

function menos() {
	if(position > 0) 
	{
		position -= 1;
		console.log(position);
		if(array_images[position] != null){
			img = "<img src='" + array_images[position][0] + "' id='image_main'>";
			print_comment();
		}
		else{
			img = "<img src='static/images/audio.png' id='image_main'>";
		}
		$("#main").html(img);
		
	}
}

function showLightbox2() {
    //mostrar el lightbox
	document.getElementById('over2').style.display='block';
	document.getElementById('fade2').style.display='block';
	document.getElementsByTagName('body')[0].style.overflow="hidden";
}
function hideLightbox2() {
    //ocultar el lightbox
    document.getElementById('over2').style.display='none';
    document.getElementById('fade2').style.display='none';
    document.getElementsByTagName('body')[0].style.overflow="auto";
	if(image_select)
	{
		image_select.cancelSelection();
		$('#location_subimage').html("");
	}
}

function showLightbox3() {
    //mostrar el lightbox
	document.getElementById('over3').style.display='block';
	document.getElementById('fade3').style.display='block';
	document.getElementsByTagName('body')[0].style.overflow="hidden";
}
function hideLightbox3() {
    //ocultar el lightbox
    document.getElementById('over3').style.display='none';
    document.getElementById('fade3').style.display='none';
    document.getElementsByTagName('body')[0].style.overflow="auto";
	
	if(image_select)
	{
		image_select.cancelSelection();
		$('#location_subimage').html("");
	}
}


function print_comment() {
	$.ajax({
		type: "GET",
		url: "/api/v1/comments/?imagen=" + array_images[position][1],
		contentType: 'application/json',
		dataType: 'json',
		cache: false,
		success: function(data){
			html = "";
	        html += '<div class="layer_comentarios">';
			html += '<div><span class="chain icon-bubble">&nbsp;&nbsp;Comentarios</span><br>';
			html += '<img src="' + document.getElementById("my_current_image").value + '" width="50px" class="image_comment">&nbsp;&nbsp; ';
			html += ' <textarea class="comment" maxlength="600" required placeholder="Comentario"></textarea><br />';
			html += '<input type="hidden" value="' + array_images[position][1] + '" class="hidden_comment"> ';
			html += '<br /> <a class="buttom_send_comment">submit</a></div>';
			html += '<div class="block_comments">';
            for(var z=0;data.objects.length>z;z++){
				html += '<div class="unt_comment">';
                html += '<div class="block_image_comment">';
				if(data.objects[z].image){
					html += '<img src="' + data.objects[z].image + '" width="50px"></div>';
					}
				else{
					html += '<img src="/static/images/sinimagen.png" width="50px"></div>';
					}
					
				html += '<div class="block_description_comments">';
				if(data.objects[z].name){
					html += '<span class="autor">' + data.objects[z].name + ' </span> - <span class="fecha">' + data.objects[z].fecha+ ' </span></div>';
				}
				else{
					html += '<span class="autor">Desconocido </span> - <span class="fecha">' + data.objects[z].date + ' </span></div>';
				}
				
					html += '<br><div class="block_content_comment">';
					html += '<span>' + data.objects[z].comment + '</span></div>';
					html += '<div class="cleaner" ></div>'
				
				    html += '<div class="block_qualify_comments">';
					
					if(data.objects[z].on_like == "likeno"){
						html += '<div onclick="send_qualify_comment(this, false, ' + data.objects[z].id + ');" class="buttom_qualify_comments" style="color:#35C0CD;" ><div class="buttom_data_qualify">' + data.objects[z].raiting[1] + '</div>';
						html += '<span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>';
						html += '<input type="hidden" value="false" class="state_like"></div>';
					}
					else{
						html += '<div onclick="send_qualify_comment(this, false, ' + data.objects[z].id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">' + data.objects[z].raiting[1] + '</div>';
						html += '<span class="icon-thumbs-up-2">&nbsp;&nbsp;</span>';
						html += '<input type="hidden" value="true" class="state_like"></div>';
					}
					
					if(data.objects[z].on_like == "like"){
						html += '<div onclick="send_qualify_comment(this, true, ' + data.objects[z].id + ');" class="buttom_qualify_comments" style="color:#35C0CD;"><div class="buttom_data_qualify">' + data.objects[z].raiting[0] + '</div>';
						html += '<span class="icon-thumbs-up">&nbsp;&nbsp;</span>';
						html += '<input type="hidden" value="false" class="state_like"></div>';
					}
					else{
						html += '<div onclick="send_qualify_comment(this, true, ' + data.objects[z].id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">' + data.objects[z].raiting[0] + '</div>';
						html += '<span class="icon-thumbs-up">&nbsp;&nbsp;</span>';
						html += '<input type="hidden" value="true" class="state_like"></div>';
					}
					
				
				if(data.next){
					html += '<div class="button_get_more_comments" onclick="get_more_comments(this);">+ commentarios';
					html += '<input type="hidden" class="comments_data_url" value="' + data.next + '"></div>';
				}
				html += "</div></div>";
			}
			$("#block_comments").html(html);
			load_buttons_comments();
        }
     });
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

function load_image(contador){  
	/*
    $('<div><img src="' + array_images[contador][0] + '" style="position: relative;" id="blockminiimagen" /><div>')
    .css({
		float: 'right',
		position: 'relative',
		overflow: 'hidden',
		width: '100px',
		height: '100px'
    }).insertAfter('#creep_image');
	
	widthimg = $('#blockminiimagen').width();
	heightimg = $('#blockminiimagen').height();
	*/
	
	//, onSelectChange: preview
    image_select = $('#creep_image').imgAreaSelect({ onSelectEnd: set_values,handles: true, aspectRatio: '1:1', x1: 120, y1: 90, x2: 220, y2: 190, instance: true});
}

//, maxWidth: 100, maxHeight: 100, minWidth: 100, minHeight: 100
function preview(img, selection) {
    var scaleX = 100 / (selection.width || 1);
    var scaleY = 100 / (selection.height || 1);
   

    $('#blockminiimagen').css({
        width: Math.round(scaleX * widthimg) + 'px',
        height: Math.round(scaleY * heightimg) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
    });
}

function submit_image(contador){ 
	if(x1)
	{
		image_select.cancelSelection();
		$('#location_subimage').html("");
		current = array_images[contador][1];
		
		$.get("croping", {x1: x1, y1: y1, x2: x2, y2: y2, id: current}, function(){
			if(image_select)
			{
				image_select.cancelSelection();
				$('#location_subimage').html("");
			}
			hideLightbox3();
		});
	}
}

function set_values(img, selection)
{
	x1 = selection.x1;
	y1 = selection.y1;
	x2 = selection.x2;
	y2 = selection.y2;  
}

function delete_image(id, position){
	m = confirm("esta seguro que desea eliminar esta imagen")
	if(m){
		$.ajax({
			type:"DELETE",
			url:"/api/v1/imagenes/"+id+"/",
			success:function(){
				$("#unidad_image_n" + id).hide(300);
				delete array_images[position];
			}
		});
	}
}

function delete_current_image_carousel(){
	m = confirm("esta seguro que desea eliminar esta imagen")
	if(m){
		$.ajax({
			type:"DELETE",
			url:"/api/v1/imagenes/"+array_images[position][1]+"/",
			success:function(){
				$("#unidad_image_n" + array_images[position][1]).hide(300);
				delete array_images[position];
				hideLightbox2();
			}
		});
	}
}

function set_image_user(contador){
	url = array_images[contador][0]
	showLightbox3();
	
	html = "<img src='"+url+"' id='creep_image'>";
	
	html2 = "<span>Selecciona el Area que deseas recortar</span><br />";
	html2 += "<span class='button_std' onclick='submit_image("+contador+")'>Recortar</span><br />";
	html2 += "<span class='button_std' onclick='image_select.cancelSelection();'>Cancelar</span><br />";
	html2 += "<span class='button_std' onclick='hideLightbox3()' >Salir</span><br />";
	
	$("#over3 #location_image_creep").html(html);
	$("#over3 #confirmation_creep").html(html2);
	
	load_image(contador);
}
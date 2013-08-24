var id = null;
var x1 = null;
var y1 = null;
var x2 = null;
var y2 = null;

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

$(document).ready(function(){
    var url = document.getElementById("url_file").value;
    document.getElementById('file_imagen').addEventListener('change', function(e) {
    
    var progressbar = $( "#progressbar" ),
    progressLabel = $( ".progress-label" );
 
    progressbar.progressbar({
      value: false,
      change: function() {
        progressLabel.text( progressbar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        progressLabel.text( "Complete!" );
      }
    });
    
    var file = this.files[0];
    
    if(file.name.length < 1) {

    }
    else if(file.size > 100000) {
        alert("File is to big");
    }
    else if(file.type != 'image/png' && file.type != 'image/jpg' && !file.type != 'image/gif' && file.type != 'image/jpeg' ) {
        alert("File doesnt match png, jpg or gif");
    }
    else{
                
    var xhr = new XMLHttpRequest();
    xhr.file = file; // not necessary if you create scopes like this
    var fd = new FormData;
        fd.append('miimagen', file);

    xhr.addEventListener('progress', function(e) {
        var done = e.position || e.loaded, total = e.totalSize || e.total;
        console.log('xhr progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
    }, false);
    if ( xhr.upload ) {
        xhr.upload.onprogress = function(e) {
            var done = e.position || e.loaded, total = e.totalSize || e.total;
            progressbar.progressbar( "value", (Math.floor(done/total*1000)/10) );
            console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
        };
    }
    xhr.onreadystatechange = function(e) {
        if ( 4 == this.readyState ) {
            console.log(['xhr upload complete', e]);
            var json = JSON.parse(this.response);
			$("#config_image").html("<div id='recuadro_cargar_imagen'></div><div id='location_subimage'></div>");
            var html = "<img src='" + json.url + "' id='image_main'>";
            html += '<div id="b_confirm_perfil" class="boton" onclick="set_perfil_image(\'' + json.url + '\', ' + json.id + ');">Confirmar como Perfil';
            html += '<input type="hidden" value="3"></div>';
            $("#recuadro_cargar_imagen").append(html);
        }
    };
    xhr.open('post', url, true);
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.send(fd);
}
}, false);

//radialgradient(['body','#F5F5F5','#000000','1300','MC']);
});

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

function set_perfil_image(imagen, id){
/*
    datas = JSON.stringify({
    "main": true,
    });
    
    $.ajax({
        type: "PUT",
        url: "/api/v1/imagenes/" + id + "/",
        contentType: 'application/json',
        dataType: 'json',
        data: datas,
        cache: false,
        success: function(data){
            $("#recuadro_cargar_imagen").html("");
            var new_imagen = '<img src="' + imagen + '" alt="imagen personal" width="200">';
            $("#block_within_foto").html("").append(new_imagen);
        }
    });
*/

    load_image(imagen, id);
}

function load_image(imagen, ide){  
	id = ide;
	$("#b_confirm_perfil").css("display", "none");
	$("#config_image").append("<a class='boton' onclick='submit_image();'>Enviar</a>");
    image_select = $('#image_main').imgAreaSelect({ onSelectEnd: set_values,handles: true, aspectRatio: '1:1', x1: 120, y1: 90, x2: 220, y2: 190, instance: true});
}

function submit_image(){ 
	if(x1)
	{
		image_select.cancelSelection();
		$('#location_subimage').html("");
		current = id
		
		$.get("croping", {x1: x1, y1: y1, x2: x2, y2: y2, id: current}, function(){
			location.href = "";
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

function set_password(id, form)
{
	$("#message_set_password").html("");
	param1 = document.getElementById("passw_before").value;
	param2 = document.getElementById("passw_after").value;
	$.get("/account/edit_password/" + id + "/",{"passw_before": param1, "passw_after": param2}, function(data){
		$("#message_set_password").html(data);
		form.reset();
	});
	return false;
}

//funcion de scroll y navegacion
function go(obj)
{
	m = obj.getAttribute("aria-hidden")
	$('html, body').animate({
         scrollTop: $(m).offset().top
     }, 1000);
}

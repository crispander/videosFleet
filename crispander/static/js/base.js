//funciones lightbox
var current_shit = true;

function get_collections(id){
    //obtener todas las colecciones de dicho usuario
    if(current_shit){
    $.get("/api/v1/namecollections/?user=" + id, function(data){
        var html = "<select id='name_collect'>";
        for(var i=0;i<data['objects'].length;i++){
            if(data['objects'][i]['name'] == "Random"){
            html += "<option selected value='" + data['objects'][i]['resource_uri'] + "'>" + data['objects'][i]['name'] + "</option>";
            }
            else{
             html += "<option value='" + data['objects'][i]['resource_uri'] + "'>" + data['objects'][i]['name'] + "</option>";
            }
        }
        html += "</select>";
        $("#select_collection").html(html);
        current_shit = false;
    });
    }
}

function mi_alerta(e){
    e.preventDefault();
	if (document.getElementById("my_current_user")){
        name_d = document.getElementById("my_current_user").value;
        name_user = document.getElementById("my_current_user_name").value;
		//
		var user = document.getElementById("data_user").value;
		var foto = $(this.parentNode).find(".data_foto")[0].value;
		var collection = $(this.parentNode).find(".data_collection")[0].value;
		var name = $(this.parentNode).find(".data_name")[0].value;
		
		showLightbox();
		//crea la estructura
		
		
		//crear la imagen
		m = document.createElement("img");
		m.setAttribute("src", foto)
		
		objdiv = document.getElementById('block_collection_image');
		objdiv.innerHTML = "";
		objdiv.appendChild(m);
		//id de la pagina
		document.getElementById('collection_page').value = collection
		document.getElementById('name_for_collection').value = name
		
		get_collections(user);
	}
	else{
		location.href = "/process/login_form/";
	}
}

function mi_alerta_collect(e){
    e.preventDefault();
	if (document.getElementById("my_current_user")){
        name_d = document.getElementById("my_current_user").value;
        name_user = document.getElementById("my_current_user_name").value;
		//
		var user = document.getElementById("data_user").value;
		var foto = $(this.parentNode).find(".data_foto")[0].value;
		var collection = $(this.parentNode).find(".data_collection")[0].value;
		var name = $(this.parentNode).find(".data_name")[0].value;
		
		if($(this).attr("value") == "yes"){
			var url = $(this.parentNode).find(".button_go_page")[0].href + "&type=ok";
			$.ajax({
				type:"GET",
				url:url,
				contentType: 'application/json',
				dataType: 'json',
				processData: false,
				success: function(data){
					//id de la pagina
					document.getElementById('collection_page').value = data.id;
				},
			})
		}
		else{
			//id de la pagina
			document.getElementById('collection_page').value = collection;
		}
		
		showLightbox();
		//crea la estructura
		
		
		//crear la imagen
		m = document.createElement("img");
		m.setAttribute("src", foto)
		
		objdiv = document.getElementById('block_collection_image');
		objdiv.innerHTML = "";
		objdiv.appendChild(m);

		document.getElementById('name_for_collection').value = name
		
		get_collections(user);
	}
	else{
		location.href = "/process/login_form/";
	}
}

function showLightbox(id, url_video, page, nombre) {
    //mostrar el lightbox
    if(id != "None" ){
        document.getElementById('over').style.display='block';
        document.getElementById('fade').style.display='block';
        document.getElementsByTagName('body')[0].style.overflow="hidden";
        
    }    
    else{
        location.href="/process/login_form/";
    }
}
function hideLightbox() {
    //ocultar el lightbox
    document.getElementById('over').style.display='none';
    document.getElementById('fade').style.display='none';
    document.getElementsByTagName('body')[0].style.overflow="auto";
}

function add_namecollection(user){
    //añadir nombre de coleccion
    name = document.getElementById("add_collection").value;
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
    }).done(function() { 
        current_shit = true;
        get_collections(user);
        document.getElementById("add_collection").value = "";
    });
    
}

function add_collection(user){
    page = document.getElementById('collection_page').value;
    namecollection = document.getElementById('name_collect').value;
    name_id = document.getElementById('name_for_collection').value;
	description = document.getElementById('description_for_collection').value;
    
    var data = JSON.stringify({
    "user": "/api/v1/user/" + user + "/",
    "page": "/api/v1/pages/" + page + "/",
    "namecollection": namecollection,
    "name": name_id,
	"comment": description,
    });
    
    $.ajax({
        type:"POST",
        url:"/api/v1/collections/",
        contentType: 'application/json',
        data: data,
        dataType: 'json',
        processData: false
    }).done(function() { 
        hideLightbox();
    });
}

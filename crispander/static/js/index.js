window.onload = function (){
    on_load_events();
    
    set_state_block_feed();
}

function on_load_events(){
    var tag = document.getElementsByTagName('a');
    for(i=0; tag.length>i; i++){
        if(tag[i].className=="add_collection") {
            m = addEvent(tag[i], 'click', mi_alerta, false);
        }
    }
}

$(window).scroll(function () {
    if(current_request_pages)
    {
        //console.log(" window = " + $(window).height() + " scroll = " + $(window).scrollTop() + " document = " + $(document).height() + " suma = " + ($(window).height() + $(window).scrollTop()));
        if ($(window).height() + $(window).scrollTop() >= $(document).height() - 10) {
            add_pages();
            current_request_pages = null;
            
        }
    }
});


function add_pages(){
    var obj = document.getElementById("block_main");
    var center = document.getElementById("center_div");
    var current = document.getElementById("more_pages").value;
    //if(current_request_pages != null){
    if(true){
        $.get(current_request_pages, function(data){
            current_request_pages = data.meta.next;
            var html = "";
            var html2 = "";
            $.each(data.objects, function(id, value){
                html += "<div class='block_pages'>";
                html += "<img src='" + value.foto + "' alt='" + value.name + "image'>";
                html += "<div class='description_page'>";
                html += "<span class='name_page'>" + value.name + "</span><br><br>";
                html += "<span>visitas: " + value.visits + "</span><br><br>";
                html += "<span><span class='color_blue'>&and;</span>" + value.like + " </span>";
                html += "<span><span class='color_blue'>&or;</span>" + value.nolike + " </span><br>";
                html += "<span><strong> total " + value.total + " </strong></span><br>";
                html += '<input type="hidden" value="' + value.foto + '" class="data_foto">';
                html += '<input type="hidden" value="' + value.id + '" class="data_collection">';
                html += '<input type="hidden" value="' + value.name + '" class="data_name">';
                html += '<a class="add_collection"></a>';
                if(value.type == "youtube"){
                    html += '<a class="button_go_page" href="/process/getorcreate/?url=' + value.urlplayer + '&name=' + value.name + '"></a>';
                }
                else{
                    html += "<a href='/page/" + value.id + "/" + value.path +"' class='button_go_page'></a>";
                }
                html += "</div></div>";
                
                html2 += '<a href="/page/' + value.id + '/' + value.path + '"><img src="' + value.foto + '"></a>';
            });
            center.innerHTML += html2;
            obj.innerHTML += html;
            on_load_events();
        });
    }
    else{
	
		(function(d){
           var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
           ref.parentNode.insertBefore(js, ref);
         }(document));
	}

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


//verifica el estado de el bloque de el index "block_main"
//si este no cuenta con un el tamaño adecuado sigue ejecucanto peticiones.
function set_state_block_feed(){
    if($("#block_main").height() < $(window).height()){
        add_pages();
        current_request_pages = null;
    }
}

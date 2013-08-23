window.onload = function (){
	//$('.leftmarquee').marquee();
	//startticker();
	$(".message_by_show").click(function(){
		value = $(this).attr("title");
		$("#mostrar_todo").html(value);
	});
	
    $("#buttom_information").click(function(){
        $("#edit_information").slideDown("slow");
    });
    comment_main2();
    var tag = document.getElementsByTagName('a');
    for(i=0; tag.length>i; i++){

        if(tag[i].className=="buttom_send_comment"){
            n = addEvent(tag[i], 'click', send_comments, false);
        }
        else if(tag[i].className=="submit_information"){
            m = addEvent(tag[i], 'click', set_information, false);
        }
    }
}

//funcion que analiza el tiempo que ha estado cada usuaio en una seccion
function tiempo() {
pageClose = new Date();
minutes = (pageClose.getMinutes() - pageOpen.getMinutes());
seconds = (pageClose.getSeconds() - pageOpen.getSeconds());
time = (seconds + (minutes * 60));
if(time<=9){
time="0"+time
}
var f=("has estado en esta seccion: " + time);
document.getElementById('r').innerHTML=f
setTimeout("tiempo()",5000)
} 

// actuailizacion de el tiempo real de la fecha
function myFunction()
{
setInterval(function(){myTimer()},1000);
}


function myTimer()
{
var d=new Date();
var t=d.toLocaleTimeString();
document.getElementById("visit_count").innerHTML=t;
}

//actualizacion de el contador de visitas
function count()
{
    setInterval(function(){getCount()},10000);
}

function getCount()
{
    var identifier = document.getElementById("identifier_page").value;
    $.get("/get_count/", {id: identifier}, function(data){
        document.getElementById("visit_count").innerHTML=data.count;
        document.getElementById("q_fine_value").innerHTML=data.fine;
        document.getElementById("q_bad_value").innerHTML=data.bad;
        //document.getElementById("q_total").innerHTML=data.fine + data.bad;
    });
}

function set_information(e) {
    e.preventDefault();
    var node = this.parentNode;
    var identifier = node.id_object.value;
    var data = node.data_information.value;
    var type_d = document.getElementById("type_object").value;
    $.get("/save_information/", {id: identifier, data_information: data, type: type_d}, function(data){
        document.getElementById("layer_information").innerHTML=data;
        $("#edit_information").slideUp("slow");
    });
}

//seleccion de los comentarios principales
function comment_main2() {
    var c = 0;
    // se llaman a todos los div unt_comment dentro de block comments
    // verifica si hay mas de 4 classes para calificar sino envialas que hay
    // se filtra para obtener los div con sus respectivas clases
    //estos se forman por [codigo ascii] - [index de el array]
    
    allclass = $(".block_comments").find(".unt_comment");
    if (allclass.length < 5){
        send_m = new Array();
        for(i=0; allclass.length>i; i++) {
            send_m.push({"value": allclass[i]})
        }

        set_main_comments(send_m);

    }else{
        for(i=0; allclass.length>i; i++){
            if(allclass[i].className=="unt_comment") {
                valuemains.push($(allclass[i]).find("#get_fine_qualify").innerHTML+ "-" + i.toString());
            }
        }
        // se organiza la lista alfabeticamente de forma acendente y luego
        // se le da reverse para quedar de forma descendente.
        // en la variable response se ingresan los primeros cuatro commentarios
        // con mejor calificacion
        valuemains.sort();
        valuemains.reverse();
        response = [valuemains[0],valuemains[1],valuemains[2],valuemains[3]]
        // en estos bucles se filtran las cadenas de las listas de response
        // y se guarda ya no mas el index de los primeros cuatro en el mismo orden
        // en el array indexmains
        // y luego se envia a otra funcion solamente los comentarios.
        // TODO: enviar tambien el autor y la fecha como firma.
        // TODO:hacer mas simple este filtrado que no necesite nos bucles
        // 
        for(x=0; response.length > x; x++){
            index_value = "";
            change = false;
            for(i=0; response[x].length > i; i++){
                if(response[x][i] == "-"){
                    change = true;
                }
                else if(change){
                    index_value= index_value + response[x][i];
                }
            }
            indexmains.push(index_value)
            
        }

        send_m = [{"value": allclass[indexmains[0]]}, {"value": allclass[indexmains[1]]}, {"value": allclass[indexmains[2]]}, {"value": allclass[indexmains[3]]}]
        set_main_comments(send_m);
    }
}

function set_main_comments(data) {
    html = "";
    if(data.length > 1){
        for(i=0; data.length > i; i++) {
            html += "<div class='blocks_main'>" + $(data[i].value).find(".inner_content_comment")[0].innerHTML + "</div>";
        }
        $("#dom_mains").html(html);
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


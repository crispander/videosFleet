var allclass = new Array();
var indexmains = new Array();
var valuemains = new Array();
var width_screen = screen.width;
if (width_screen <= 850){
    bucle_bar = 2;
    }
else{
    bucle_bar = 2;
}

//barra de movimiento
var myInterval = null;
var myInterval_mess = null;
var state_mov = true;



//actualizacion de mensajes ubicados en la barra de tiempo real
function actualize_bar()
{
	if(state_mov)
	{
		myInterval_mess = setInterval(function(){
		var d = new Date;
		d.setSeconds(d.getSeconds() - 5);
			$.get("/api/v1/messagebar/?date__gte=" + d.format("isoDateTime"), function(data){
				$.each(data.objects, function(index, value){
					var s = new Date(value.data_serialized * 1000)
						$("#marquee_replacement").append("<span><span class='fecha'>" +
						//s.format('HH:MM:ss TT') + "</span>" + 
						s.format('HH:MM') +
						"</span>&nbsp;&nbsp;<img height='10px' src='/static/images/countries/" + value.country + ".gif' class='image_country'>&nbsp;&nbsp;<span class='content'>" + 
						value.message + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
					});
			});
		}, 5000);
	}
	else{
		myInterval_mess=window.clearInterval(myInterval_mess);
	}
}


// envio de peticiones post a la api
function send_message_bar()
{
    var value = document.getElementById("input_bar").value;
	if(value != "")
	{
		var value_c = document.getElementById("select_country").value;
		var data = JSON.stringify({
			"message": value,
			"country": value_c
			});
		
		$.ajax({
			type:"POST",
			url:"/api/v1/messagebar/",
			contentType: 'application/json',
			data: data,
			dataType: 'json',
			processData: false
		});
		
		document.getElementById("input_bar").value = "";
	}
	else
	{
		alert("porfavor ingrese un valor");
	}
}


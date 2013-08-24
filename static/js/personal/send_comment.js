//funcion de envio de comentario a la vista /save_comment/
function send_comments(e) {
    e.preventDefault();
    var comment_d = $(this.parentNode).find(".comment")[0];
    var image = $(this.parentNode).find(".image_comment")[0].src;
    var type_object = document.getElementById("type_object").value;
    var identifier = $(this.parentNode).find(".hidden_comment")[0].value;
    var block_comments = $(this.parentNode.parentNode).find(".block_comments")[0];
    
    if(document.getElementById("my_current_user")){
        name_d = document.getElementById("my_current_user").value;
        name_user = document.getElementById("my_current_user_name").value;

    
    if(comment_d=="" || comment_d==null){
        alert("Porfavor escriba su comentario y nombre");
        return false;
    }
    else{
        $.get("/save_comment/", {name: name_d, comment: comment_d.value, user_id: identifier, type: type_object}, function(data){
            var newHTML = "<div class='unt_comment'>";
            newHTML += "<div class='block_image_comment'>";
            newHTML += "<img src='" + image + "' width='50'></div>";
            newHTML += '<div class="block_description_comments">';
            newHTML += '<span class="autor">' + name_user + '</span> - <span class="fecha">' + data.date + ' </span></div>';
			
			newHTML += '<br><div class="block_content_comment">';
            newHTML += "<span>" + comment_d.value + "</span></div>";
            newHTML += '<div class="cleaner" ></div>';
			
            newHTML += '<div class="hidden_toggle"><div class="block_qualify_comments">';
            if(data.onlike == "like"){
                newHTML += '<div onclick="send_qualify_comment(this, true, ' + data.id + ');" class="buttom_qualify_comments" style="opacity:1"><div class="buttom_data_qualify">0</div>';
                newHTML += '<img src="/static/images/like.png" height="20">';
                newHTML += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                newHTML += '<div onclick="send_qualify_comment(this, true, ' + data.id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">0</div>';
                newHTML += '<img src="/static/images/like.png" height="20">';
                newHTML += '<input type="hidden" value="true" class="state_like"></div>';
            }
            
            if(data.onlike == "likeno"){
                newHTML += '<div onclick="send_qualify_comment(this, false, ' + data.id + ');" class="buttom_qualify_comments" style="opacity:1"><div class="buttom_data_qualify">0</div>';
                newHTML += '<img src="/static/images/nolike.png" height="20">';
                newHTML += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                newHTML += '<div onclick="send_qualify_comment(this, false, ' + data.id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">0</div>';
                newHTML += '<img src="/static/images/nolike.png" height="20">';
                newHTML += '<input type="hidden" value="true" class="state_like"></div></div>';
            }
            
            newHTML += "</div>";
            
            newHTML += "</div>";
            
            $(block_comments).prepend(newHTML);
            comment_d.value = "";
        });
        }
    }
    else{
        location.href = "/process/login_form/";
    }
}


//calificacion de los comentarios
function send_qualify_comment(current, value, id_object){
    var state_like = $(current).find(".state_like")[0];
    if(document.getElementById("my_current_user")){
        if(state_like.value == "true"){     
            if(value){
                datas = JSON.stringify({
                "user": "/api/v1/user/" + document.getElementById("my_current_user").value + "/",
                "type_object": "/api/v1/comments/" + id_object + "/",
                "value": true,
                });
            }
            else{
                datas = JSON.stringify({
                "user": "/api/v1/user/" + document.getElementById("my_current_user").value + "/",
                "type_object": "/api/v1/comments/" + id_object + "/",
                "value": false,
                });
            }
                
                console.log(datas);
                $.ajax({
                type: "POST",
                url: "/api/v1/qualifycomments/",
                contentType: 'application/json',
                dataType: 'json',
                data: datas,
                cache: false,
                success: function(data){
                    state_like.value = "false";
                    m = $(current.parentNode).find(".buttom_qualify_comments");
                    for(var i=0;m.length > i;i++){
                        $(m[i]).css("color", "gray");
                        if(m[i] != current){
                            $(m[i]).children()[0].value = "true";
                        }
                    }
                    
                    $(current).css("color", "#35C0CD");
                    }
                });
            }
        }
    else{
            location.href = "/process/login_form/";
    }
}

//boton para obtener mas comentarios
function get_more_comments(obj){
    page = $(obj).find(".comments_data_url")[0].value;
    $.ajax({
    type: "GET",
    url: page,
    //data: datas,
    cache: false,
    success: function(data){
        obj.style.display = "none";
        var comments_html = build_comments(data.objects);
        if(data.meta.next){
            comments_html += '<div class="button_get_more_comments" onclick="get_more_comments(this);">+ commentarios';
            comments_html += '<input type="hidden" class="comments_data_url" value="' + data.meta.next + '"></div>';
        }
        obj.parentNode.innerHTML += comments_html;
    }
    });
}


function build_comments(data){
    html = "";
    for(var z=0;data.length>z;z++){
        html += '<div class="unt_comment">';
        html += '<div class="block_image_comment">';
        if(data[z].imagen){
            html += '<img src="' + data[z].imagen + '" width="50px"></div>';
        }
        else{
            html += '<img src="/static/images/sinimagen.png" height="50px"></div>';
        }
        html += '<div class="block_description_comments">';
        if(data[z].name){
            html += '<span class="autor">' + data[z].name + ' </span> - <span class="fecha">' + data[z].date + ' </span></div>';
        }
        else{
            html += '<span class="autor">Desconocido </span> - <span class="fecha">' + data[z].date + ' </span></div>';
        }
        
            html += '<div class="block_qualify_comments">';
            if(data[z].on_like == "like"){
                html += '<div onclick="send_qualify_comment(this, true, ' + data[z].id + ');" class="buttom_qualify_comments" style="opacity:1;"><div class="buttom_data_qualify">' + data[z].raiting[0] + '</div>';
                html += '<img src="/static/images/like.png" height="30">';
                html += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                html += '<div onclick="send_qualify_comment(this, true, ' + data[z].id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">' + data[z].raiting[0] + '</div>';
                html += '<img src="/static/images/like.png" height="30">';
                html += '<input type="hidden" value="true" class="state_like"></div>';
            }
            
            if(data[z].on_like == "likeno"){
                html += '<div onclick="send_qualify_comment(this, false, ' + data[z].id + ');" class="buttom_qualify_comments" style="opacity: 1;"><div class="buttom_data_qualify">' + data[z].raiting[1] + '</div>';
                html += '<img src="/static/images/nolike.png" height="30">';
                html += '<input type="hidden" value="false" class="state_like"></div>';
            }
            else{
                html += '<div onclick="send_qualify_comment(this, false, ' + data[z].id + ');" class="buttom_qualify_comments"><div class="buttom_data_qualify">' + data[z].raiting[1] + '</div>';
                html += '<img src="/static/images/nolike.png" height="30">';
                html += '<input type="hidden" value="true" class="state_like"></div>';
            }
            
            html += "</div><br>";
            
        html += '<div class="block_content_comment">';
        html += '<span>' + data[z].comment + '</span></div>';
        html += '<div class="cleaner" ></div>'
        
        html += "</div>";
    }
    
    return html;
}

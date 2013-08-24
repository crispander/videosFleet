function on_suscription_toggle(current, value1, value2){
    if(value2){
        datas = JSON.stringify({
        "user": "/api/v1/user/" + value1 + "/",
        "follow_to": "/api/v1/user/" + value2 + "/",
        });
        
        $.ajax({
            type: "POST",
            url: "/api/v1/subscriptions/",
            contentType: 'application/json',
            dataType: 'json',
            data: datas,
            cache: false,
            success: function(data){
                current.innerHTML = "siguiendo";
                current.onclick = "";
            }
        });
    }
    else{
        $.ajax({
        type: "DELETE",
        url: "/api/v1/subscriptions/" + value1 + "/",
        cache: false,
        success: function(data){
            current.innerHTML= "seguir"
            current.onclick = "";
        }
        });
    }
}

function on_like_toggle(current, value, id_collect){
    var state_like = $(current).find(".state_like")[0];
    if(document.getElementById("my_current_user")){
        if(state_like.value == "true"){
            type_object = document.getElementById("type_object").value;
            if (type_object == "collection"){
                var resource_name = "/api/v1/collections/";
                var post_resource = "/api/v1/qualifycollect/";
            }
            else{
                var resource_name = "/api/v1/pages/";
                var post_resource = "/api/v1/qualifypage/";
            }

            if(value){
                oauth_face();
                datas = JSON.stringify({
                "user": "/api/v1/user/" + document.getElementById("my_current_user").value + "/",
                "type_object": resource_name + id_collect + "/",
                "value": true,
                });
            }
            else{
                datas = JSON.stringify({
                "user": "/api/v1/user/" + document.getElementById("my_current_user").value + "/",
                "type_object": resource_name + id_collect + "/",
                "value": false,
                });
            }
                
                console.log(datas);
                $.ajax({
                type: "POST",
                url: post_resource,
                contentType: 'application/json',
                dataType: 'json',
                data: datas,
                cache: false,
                success: function(data){
                    state_like.value = "false";
                    m = $(current.parentNode).find(".buttoms_of_quals");
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


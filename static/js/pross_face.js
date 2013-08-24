function oauth_face(){
    //var body = 'Bienvenidos a la electro music encontraras, un sitio dedicado a la musica electronica <a href="http://videos-cristanmontoya.dotcloud.com/">Ir a Conocerla</a>';
    //FB.api('/me/feed', 'post', { message: body }, function(response) {
        //if (!response || response.error) {
            //console.log('Error occured');
        //} else {
            //console.log('Post ID: ' + response.id);
        //}
//});

}

function logout(){
    FB.logout(function(){
        location.href="/process/logout/";
    });
}

  // Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '419360901469098', // App ID
      channelUrl : 'videos-cristanmontoya.dotcloud.com', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
    //testAPI();
    //oauth_face();
  } else if (response.status === 'not_authorized') {
        console.log("conectado pero no autorizado");
  } else {
        console.log("sin conexion a facebook");
  }
 });

  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));

var isAndroid = false;
var first = false;
var info = {};
var googleAuth = Alloy.Globals.googleAuth;

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10;

Ti.Geolocation.getCurrentPosition(function(e){
    if(e.error){
        alert("SEPA QUE CAN'T GET U CURREN LOCAITON");
        return;
    }
    alert("latitude: " + e.coords.latitude + "\nlongitude: " + e.coords.longitude);
    e.coords.longitude;
    var latitude = e.coords.latitude;
});
function login(e){
    Ti.API.info('Authorized:' + googleAuth.isAuthorized());
    googleAuth.isAuthorized(function(){
        console.log("Function one");
        Ti.API.info('Access Token: ' + googleAuth.getAccessToken());

    },function(){
        console.log("Function two");
        Ti.API.info('Authorize google account.....');
        googleAuth.authorize(function(){
            loginChek();
            getUserInfo();
        });
    });
}
function getUserInfo(){
    var xhr;
    var resp;
    var data = {};
        xhr = Ti.Network.createHTTPClient({
            onload : function(e){
                resp = JSON.parse(this.responseText);
                info.name = resp.name;
                info.givenName = resp.given_name;
                info.email = resp.email;
                //console.log("Name: " + info.name + "\nGivenName: " + info.givenName + "\nEmail :" + info.email);
                addNewAnnotation(info.givenName);
            },
            onerror : function(e){
                log.info(e.error);
                log.info(this.responseText);
                log.info(this.status);
            },
            timeout : 5000
        });
        xhr.open("GET",'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + googleAuth.getAccessToken());
        xhr.send();
}
function loginChek(){
    if(googleAuth.isAuthorized()){
        getUserInfo();
        $.win.remove($.login);
        $.Bar.setVisible(true);
    }
}
function addNewAnnotation(name){
    var addAnnotation;
        if(isAndroid){
            addAnnotation = Ti.Map.createAnnotation({
                pincolor:Ti.Map.ANNOTATION_PURPLE,
                latitude:20.658165,
                longitude:-103.349762
            });
        }
        else{
            addAnnotation = Alloy.Globals.Map.createAnnotation({
                pinsolor:Alloy.Globals.Map.ANNOTATION_PURPLE,
                latitude:20.658165,
                longitude:-103.349762
            });
        }
        addAnnotation.title = name;
        addAnnotation.subtitle = ":D";
        addAnnotation.animate = true;
        addAnnotation.dragable = true;

    $.mapView.addAnnotation(addAnnotation);
    $.mapView.selectAnnotation(addAnnotation);
}
function showMenu(e){
    var items = [
    	{
            properties : {
                title: info.name,
                backgroundColor:"#2052BF",
                color:"#08E3FB"
            }
        },
    	{
            properties : {
                title: info.email,
                backgroundColor:"#2052BF",
                color:"#08E3FB"
            }
        }
    ];
    $.listS.setHeaderTitle(info.givenName);
    $.list.sections[0].setItems(items);
    if(!first){
        first = true;
        $.setting.setVisible(true);
        $.menuIcon.setLeft(280);
    }
    else{
        first = false;
        $.setting.setVisible(false);
        $.menuIcon.setLeft(15);
    }
}
if(Ti.Platform.osname == "android"){
    isAndroid = true;
    $.win.addEventListener('open',function(e){
        $.win.activity.actionBar.hide();
    });
}
function closeSett(e){
    $.setting.setVisible(false);
    $.menuIcon.setLeft(15);
    first = false;
}
function showModal(e){

    var win = Alloy.createController('notif').getView();

    if(isAndroid){
        win.open({
            animated:true,
            activityEnterAnimation: Ti.Android.R.anim.slide_in_left,
            activityExitAnimation: Ti.Android.R.anim.slide_out_right
        });
    }
    else{
        win.open();
    }
}
$.win.open();

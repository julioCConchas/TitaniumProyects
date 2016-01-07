var isAndroid = false;
var first = false;
var flag = false;
var info = {};
var googleAuth = Alloy.Globals.googleAuth;
var geoInfo = {};
var routeRemove;
var empImgs = [];

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10;

Ti.Geolocation.getCurrentPosition(function(e){
    if(e.error){
        alert("CAN'T GET YOU CURREN LOCAITON");
        return;
    }
    geoInfo.latitude  = e.coords.latitude;
    geoInfo.longitude = e.coords.longitude;
    console.log("**latitude: " + e.coords.latitude + "\n**longitude: " + e.coords.longitude);
});

//--------------------------------------------->
    //notification test
    // Intent object to launch the application
var intent = Ti.Android.createIntent({
    action: Ti.Android.ACTION_MAIN,
    // Substitute the correct class name for your application
    className: 'com.appcelerator.notificationsample.NotificationsampleActivity',
    // Substitue the correct package name for your application
    packageName: 'com.appcelerator.notificationsample'
});
intent.flags |= Ti.Android.FLAG_ACTIVITY_CLEAR_TOP | Ti.Android.FLAG_ACTIVITY_NEW_TASK;
intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

// Create a PendingIntent to tie together the Activity and Intent
var pending = Titanium.Android.createPendingIntent({
    intent: intent,
    flags: Titanium.Android.FLAG_UPDATE_CURRENT
});

// Create the notification
var notification = Titanium.Android.createNotification({
    // icon is passed as an Android resource ID -- see Ti.App.Android.R.
    icon: Ti.App.Android.R.drawable.appicon,
    contentTitle: 'Something Happened',
    contentText : 'Click to return to the application.',
    contentIntent: pending
});

// Send the notification.
//Titanium.Android.NotificationManager.notify(1, notification);



//--------------------------------------------->
function doClick(e){
    var img;

        for (var i = 0,size = empImgs.length; i < size; i++) {
            if(e.annotation.title == empImgs[i].name){
                $.imgEmpl.setImage(empImgs[i].image);
            }
        }
    $.modal.setVisible(true);
    $.detalle.setVisible(true);

    if(flag == false){
        createRoutes(e.annotation.latitude,e.annotation.longitude);
        flag = true;
    }
    else {
        console.log("pos removi");
        $.mapView.removeRoute(routeRemove);
        createRoutes(e.annotation.latitude,e.annotation.longitude);
    }
}
function login(e){
    Ti.API.info('Authorized:' + googleAuth.isAuthorized());
    googleAuth.isAuthorized(function(){
        //console.log("Function one");
        Ti.API.info('Access Token: ' + googleAuth.getAccessToken());

    },function(){
        //console.log("Function two");
        Ti.API.info('Authorize google account.....');
        googleAuth.authorize(function(){
            loginChek();
            getUserInfo();
        });
    });
}
function setAnnotations(){
    //co workers annotations
    addNewAnnotation("Peter",20.609186,-103.3989,null);
    addNewAnnotation("Gwen",20.735919,-103.397714,null);
    addNewAnnotation("Bruse",20.667626,-103.269821,null);
    addNewAnnotation("Pancho",20.713446,-103.318882,null);
    addNewAnnotation("Office",20.65731664,-103.39767158,null);
}
function getEmployees(){
    var xhr;
    var reso;
    var employee;

        xhr = Ti.Network.createHTTPClient({
            onload : function(e){
                resp = JSON.parse(this.responseText);
                for (var i = 0, length = resp.employees.length; i < length; i++) {
                    employee = resp.employees[i];
                    info.name = employee.name;
                    info.image = employee.image;
                    empImgs.push({
                        name : employee.name,
                        image : employee.image
                    });
                    addNewAnnotation(employee.name,employee.addrees,employee.latitude,employee.longitude);
                }
                //test
                empImgs.push({
                    name: "Julio César",
                    image : "/images/people.jpg"
                });
            },
            onerror : function(e){
                log.info(e.error);
                log.info(this.responseText);
                log.info(this.status);
            },
            timeout : 5000,
            validatesSecureCertificate : true
        });
        xhr.open("GET",'https://raw.githubusercontent.com/julioCConchas/JSON/master/employees.txt');
        xhr.send();
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
                addNewAnnotation(info.givenName,"tabachin #48",geoInfo.latitude,geoInfo.longitude);
            },
            onerror : function(e){
                log.info(e.error);
                log.info(this.responseText);
                log.info(this.status);
            },
            timeout : 5000,
            validatesSecureCertificate: true
        });
        xhr.open("GET",'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + googleAuth.getAccessToken());
        xhr.send();
}
function loginChek(){
    if(googleAuth.isAuthorized()){
        getUserInfo();
        $.win.remove($.login);
        $.Bar.setVisible(true);
        $.mapView.setTouchEnabled(true);
        //setAnnotations();
    }
    Titanium.Android.NotificationManager.notify(1, notification);
    getEmployees();
}
function addNewAnnotation(name,addrees,latitude,longitude){
    var addAnnotation;
        if(isAndroid){
            addAnnotation = Ti.Map.createAnnotation();
        }
        else{
            addAnnotation = Alloy.Globals.Map.createAnnotation();
        }
        addAnnotation.title = name;
        addAnnotation.subtitle = addrees;
        addAnnotation.image = "/images/pin.png";
        addAnnotation.latitude = latitude;
        addAnnotation.longitude = longitude;
        addAnnotation.animate = true;
        addAnnotation.dragable = true;

    $.mapView.addAnnotation(addAnnotation);
    $.mapView.selectAnnotation(addAnnotation);
}
function createRoutes(latitude,longitude){
    //drawing the routes
    var latOffice = 20.6577;
    var longOffice = -103.398;
    var url = "http://maps.googleapis.com/maps/api/directions/xml?origin=" + latitude + ',' + longitude + "&destination=" + latOffice+ ',' + longOffice + "&sensor=false";
    var points = [];
    var resp;
    var xhr;
    var xml;
    var steps;
    var numSteps;
    var step;
    var endLocation;
    var lat;
    var lng;
    var route;

        xhr = Ti.Network.createHTTPClient({
            onload : function(){
                //console.log(this.responseText);
                xml = this.responseXML;
                steps = xml.documentElement.getElementsByTagName('step');
                numSteps = steps.length;

                    for(var i = 0; i < numSteps; i++){
                        step = steps.item(i);
                        endLocation = step.getElementsByTagName('end_location').item(0);
                        lat = endLocation.getElementsByTagName('lat').item(0).text;
                        lng = endLocation.getElementsByTagName('lng').item(0).text;

                        points.push({
                            latitude: lat,
                            longitude: lng
                        });
                    }
                    //create route
                    route = {
                        name: 'My Route',
                        points: points,
                        color: 'purple',
                        width: 3
                    };
                    routeRemove = route;
                    $.mapView.addRoute(route);
            },
            onerror : function(){
                log.info(e.error);
                log.info(this.responseText);
                log.info(this.status);
            },
            timeout : 5000,
            validatesSecureCertificate : true
        });
        xhr.open("GET",url);
        xhr.send();
}
function showMenu(e){
    var items = [
    	{
            properties : {
                title: info.name,
                backgroundColor:"#072775",
                color:"white"
            }
        },
    	{
            properties : {
                title: info.email,
                backgroundColor:"#072775",
                color:"white"
            }
        }
    ];
    $.listS.setHeaderTitle(info.givenName);
    $.list.sections[0].setItems(items);
    if(!first){
        first = true;
        $.setting.setVisible(true);
        $.menuIcon.setLeft("87%");
    }
    else{
        first = false;
        $.setting.setVisible(false);
        $.menuIcon.setLeft("5%");
    }
}
if(Ti.Platform.osname == "android"){
    isAndroid = true;
    $.win.addEventListener('open',function(e){
        $.win.activity.actionBar.hide();
    });
}
function closeModal(e){
    $.modal.setVisible(false);
    $.detalle.setVisible(false);
}
function closeSett(e){
    $.setting.setVisible(false);
    $.menuIcon.setLeft("5%");
    first = false;
    $.modal.setVisible(false);
    $.detalle.setVisible(false);
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

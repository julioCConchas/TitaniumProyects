var isAndroid = false;
var first = false;
var googleAuth = Alloy.Globals.googleAuth;

function login(e){

    Ti.API.info('Authorized:' + googleAuth.isAuthorized());
    googleAuth.isAuthorized(function(){
        console.log("Function one");
        Ti.API.info('Access Token: ' + googleAuth.getAccessToken());

    },function(){
        console.log("Function two");
        Ti.API.info('Authorize google account.....');
        googleAuth.authorize();
    });

}
function addNewAnnotation(e){
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
        addAnnotation.title = "Peña";
        addAnnotation.subtitle = ":D";
        addAnnotation.animate = true;
        addAnnotation.dragable = true;

    $.mapView.addAnnotation(addAnnotation);
    $.mapView.selectAnnotation(addAnnotation);
}
function showMenu(e){
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

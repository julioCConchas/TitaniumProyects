var isAndroid = false;

function login(){
    if($.txfUser.value == "jconchas@itexico.net" &&
       $.txfPass.value == "12011347"){
           if(Ti.Platform.osname == "android"){
               isAndroid = true;
               $.win.remove($.login);
           }
           else{
               $.mapView.remove($.login);
           }
       }
       $.menuIcon.setVisible(true);
       addNewAnnotation();
       console.log("done");
}


function addNewAnnotation(){
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
        addAnnotation.title = "JulioConchas";
        addAnnotation.subtitle = "needs ride";
        addAnnotation.animate = true;
        addAnnotation.dragable = true;

    $.mapView.addAnnotation(addAnnotation);
    $.mapView.selectAnnotation(addAnnotation);
}
function showMenu(){
    var win;
        if(isAndroid){
            win = Alloy.createController('settings').getView().open();
        }
        else{
            win = Alloy.createController('settings').getView().open();
        }
}











function hiddenBar(){
    $.win.activity.actionBar.hide();
}
$.win.open();

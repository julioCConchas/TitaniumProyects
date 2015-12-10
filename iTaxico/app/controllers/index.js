var isAndroid = false;

function login(){
    if($.txfUser.value == "jconchas@itexico.net" &&
       $.txfPass.value == "12011347"){
               $.win.remove($.login);
       }
       else{
           alert("Wrong user or password!.");
           $.txfUser.setValue(null);
           $.txfPass.setValue(null);
       }
       $.menuIcon.setVisible(true);
      // addNewAnnotation();
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
    $.setting.setVisible(true);
}

if(Ti.Platform.osname == "android"){
    isAndroid = true;
    $.win.addEventListener('open',function(e){
        $.win.activity.actionBar.hide();
    });
}
function closeSett(){
    $.setting.setVisible(false);
}


$.win.open();

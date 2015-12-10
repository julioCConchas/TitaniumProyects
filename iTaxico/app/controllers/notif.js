var args = arguments[0] || {};


if(Ti.Platform.osname == "android"){
    $.win.addEventListener('open',function(e){
        $.win.activity.actionBar.hide();
    });
}

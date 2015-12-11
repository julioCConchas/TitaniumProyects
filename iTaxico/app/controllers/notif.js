var args = arguments[0] || {};


function closeWin(e){
    $.win.close();
}

if(Ti.Platform.osname == "android"){
    $.win.addEventListener('open',function(e){
        $.win.activity.actionBar.hide();
    });
}

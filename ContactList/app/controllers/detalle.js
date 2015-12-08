var args = arguments[0] || {};
var dataBase = require('/ui/dataBase');
var data = [];
var titulo;
data.id = args.id;



function winDelete(){
	dataBase('delete',args.id);
	  $.win.addEventListener('close',function(e){
	    alert('was deleting');
	  });
	  winClose();
}
function winClose(){
	$.win.close();
}
function winCall(){
	alert("Calling some one!!.");
}
function winMap(){
	var win = Alloy.createController('mapDetalle',data).getView().open();
}
$.win.addEventListener('focus',function(){
	var dataBaseObj = new dataBase('query',args.id),
	img = Ti.UI.createImageView({
	    image:dataBaseObj[0]
	});
	data.name = dataBaseObj[1];
	data.address = dataBaseObj[dataBaseObj.length-1];

	$.imgContact.add(img);
	$.imgContact.setBackgroundImage(" ");
	$.winTitle.setText(dataBaseObj[1]);
	for(var i = 1;i <dataBaseObj.length;i++){
	    var lbl = Ti.UI.createLabel({
			color:"white",
	        text:dataBaseObj[i].toString(),
	        top:10,
	        font:{
	          fontSize:20,
	        }
	    });
	$.infoView.add(lbl);
	}
});

function hiddenTitle(e){
	$.win.activity.actionBar.hide();
}

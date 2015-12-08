var database = require('/ui/dataBase');

function winAdd(e) {
	var win2 = Alloy.createController('add').getView().open();
}
function showContacts(e){
  	database('create',null);
  	var dataBaseObjId = new database('querying','id');
  	var dataBaseObjName = new database('querying','name');
	var dataBaseObjImg;
	var data = [];
	var isAndroid = false;

	if(Ti.Platform.osname == "android"){
			Ti.API.info("Android");
			isAndoid = true;
			dataBaseObjImg = new database('querying','imgUrl');
	}
	else{
		dataBaseObjImg = new database('querying','image');
		Ti.API.info("ios");
	}

  	for(var i in dataBaseObjId){
    	var row = Ti.UI.createTableViewRow({
      	id:dataBaseObjId[i],
    });
    lbl = Ti.UI.createLabel({
    	color:'white',
      	text:dataBaseObjName[i],
      	touchEnabled:false,
      	left:60
    });
    img = Ti.UI.createImageView({
      	touchEnabled:false,
      	image:dataBaseObjImg[i],
      	height:50,
      	width:50,
      	left:0
    });
    row.add(lbl);
    row.add(img);
    data.push(row);
  }
  	$.table.data = data;
}
function tableClicked(e){
  	var win = Alloy.createController('detalle',e.source).getView().open();
}
function hiddenTitle(){
	$.index.activity.actionBar.hide();
}
$.index.open();

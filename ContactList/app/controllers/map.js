var args = arguments[0] || {};
var dataBase = require('/ui/dataBase');

function doClick(e){
	$.mapView.removeEventListener('regionChanged',setLatLong);
  	//Insertar coordenadas en base de datos
  	args.latitude = latitude;
  	args.longitude = longitude;
  	//Cerrar la ventana de mapa
  	$.win.close();
}
function closeWin(){
  $.win.close();
}

var anAdded = false;
var addAn;
var latitude;
var longitude;

function addNewAn(){
	addAn = Ti.Map.createAnnotation({
		latitude:latitude,
		longitude:longitude,
		title:args.name,
		subtitle:args.address,
		pincolor:Ti.Map.ANNOTATION_PURPLE,
		animate:true,
		dragable:true
	});
	$.mapView.addAnnotation(addAn);
	$.mapView.selectAnnotation(addAn);
	anAdded = true;
}
function setLatLong(e){
	latitude = e.latitude;
	longitude = e.longitude;
		if(anAdded == true){
			$.mapView.removeAnnotation(addAn);
			addNewAn();
		}
};
function setAnnotation(e){
  	alert("click to set pin");
   	if(anAdded == true){
      	$.mapView.removeAnnotation(addAn);
         	addNewAn();
   	}
   	else addNewAn();
}
if(Ti.Platform.osname == "android"){
	$.win.addEventListener('open', function(e) {
	    $.win.activity.actionBar.hide();
	});
}

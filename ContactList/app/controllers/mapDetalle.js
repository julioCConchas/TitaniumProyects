var args = arguments[0] || {},
dataBase = require('/ui/dataBase'),
annotation;
dataBaseObj = new dataBase('queryMap',args.id);

annotation = Ti.Map.createAnnotation({
  latitude:dataBaseObj[0],
  longitude:dataBaseObj[1],
  title:args.name,
  subtitle:args.address,
  pincolor:Ti.Map.ANNOTATION_RED,
  animate:true,
  dragable:true
});
$.mapView.addAnnotation(annotation);
$.mapView.selectAnnotation(annotation);

$.win.addEventListener('open', function(e) {
    $.win.activity.actionBar.hide();
});

    var args = arguments[0] || {};
    var urlImg;
    var dataBase = require('/ui/dataBase');
    var data1 = [];
    var latitude;
    var longitude;
    var blobimg;
    var isAndroid = false;

if(Ti.Platform.osname == "android"){
    isAndoid = true;
    $.win.addEventListener('focus', function(e) {
        $.win.activity.actionBar.hide();
    });
}
function winClose(){
    $.win.close();
}

function addContact(){
    var data = [];
    data.name = $.txfName.value;
    data.cel = $.txfCel.value;
    data.email = $.txfEmail.value;
    data.address = $.txfAddress.value;
    data.latitude = data1.latitude;
    data.longitude = data1.longitude;

        if(isAndoid){
            data.image = urlImg;
        }
        else{
            data.image = blobimg;
        }

    if(!$.txfName.value || !$.txfCel.value
        || !$.txfEmail.value || !$.txfAddress.value || !data.url){
        alert('must fill the fields!!.');
      }
     else{
        dataBase('add',data);
        $.win.close();
      }
}
var camera = {
    onSuccess:function(e){
        if(e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO){

        }
    },
    onCancel:function(e){
        alert("Photo cancelled");
    },
    onError:function(e){
          alert("This is not a photo or video!!.");
    }
}

//set an image contact!!

var img,
camera = {
      onSuccess:function(e){
        //here save the url in to the dataBase
          urlImg = e.media.getNativePath();
          if(e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO){
            //$.imgContact.setBackgroundImage(urlImg);
            if(img)$.imgContact.remove(img);
            img = Ti.UI.createImageView({
              image: urlImg
            });
            $.imgContact.setBackgroundImage(" ");
            $.imgContact.add(img);
        }
        else alert("This is not a photo!.");
      },
      onCancel:function(e){alert("Photo cancelled!!.");},
      onError:function(e){alert("This is not a photo!.");}
    },
    options = {
      onSuccess:function(e){
        urlImg = e.media.getNativePath();
         if(e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO){
              $.imgContact.setBackgroundImage(urlImg);
          }
          else alert("This is not a photo!.");
      },
      onCancel:function(e){alert("Cancelled.");},
      onError:function(e){alert("This is not a photo")}
    }
    function setImage(){$.Od.show();}
    function option(e){
      //alert("option: " + e.index);
      if(e.index == 0)setImageFromGallery();
      else setImageFromCamera();
    }
    function setImageFromGallery(){
       Ti.Media.openPhotoGallery({
         success: options.onSuccess,
         cancel: options.onCancel,
         error: options.onError,
         allowEditing:true,
         mediaType:[Ti.Media.MEDIA_TYPE_PHOTO]
       });
    }
    function setImageFromCamera(){
      Ti.Media.showCamera({
        success: camera.onSuccess,
        cancel: camera.onCancel,
        error: camera.onError,
        allowEditing:true,
        mediaType:[Ti.Media.MEDIA_TYPE_PHOTO],
        videoQuality: Ti.Media.QUALITY_HIGH,
        saveToPhotoGallery:true
      });
    }

    ///Map//
    function showMap(e){
      data1 = {
        name:$.txfName.value,
        address:$.txfAddress.value,
        latitude:0,
        longitude:0
      };
      var win = Alloy.createController('map',data1).getView();
      win.open();
    }
if(Ti.Platform.osname == "android"){
    $.win.addEventListener('focus', function(e) {
        $.win.activity.actionBar.hide();
    });
}

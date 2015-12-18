// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.Map = require("ti.map");
Alloy.Globals.GoogleAuth_module = require('googleAuth');
Alloy.Globals.googleAuth = new Alloy.Globals.GoogleAuth_module({
    clientId:'171086706622-749tm52o51e8edkv3lbki4mbefk85923.apps.googleusercontent.com',
	clientSecret:'01vUdkmlPvwW29irSbVmbZly',
	propertyName : 'googleToken',
	quiet: false,
	scope : ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']//[ 'https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly' ]
});

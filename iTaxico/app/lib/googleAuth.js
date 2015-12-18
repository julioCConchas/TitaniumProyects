var GoogleAuth = function(e){
    var _version = '0.3.2';
    var _opt;
    var log;
    var win;
    var _prop = {};
    var prop = {};
    e = (e) ? e : {};

    _opt = {
        clientId : (e.clientId) ? e.clientId : null,
        clientSecret: (e.clientSecret) ? e.clientSecret : null,
        propertyName : (e.propertyName) ? e.propertyName : 'googleToken',
        url : 'https://accounts.google.com/o/oauth2/auth',
        //url : 'https://accounts.google.com/o/oauth2/v2/auth',
        scope : (e.scope) ? e.scope :['https://www.googleapis.com/auth/tasks'],
        closeTitle : (e.closeTitle) ? e.closeTitle : 'Close',
        winTitle : (e.winTitle) ? e.winTitle : 'Google Account',
        errorText : (e.errorText) ? e.errorText : 'Can not authorize user!',
        winColor : (e.winColor) ? e.winColor : '#00',
        quiet : (typeof (e.quiet) === 'undefined') ? true : e.quiet
    };
    log = function(){};
    log.error = function(e){
        if(!_opt.quiet){
            Ti.API.error('' + e);
        }
    };
    log.info = function(e){
        if(!_opt.quiet){
            Ti.API.info(e);
        }
    };
    log.debug = function(e){
        if(!_opt.quiet){
            Ti.API.debug('' + e);
        }
    };
    log.trace = function(e){
        if(!_opt.quiet){
            Ti.API.trace('' + e);
        }
    };

    log.info('-------------------------------------');
	log.info('| Google Account Authentification   |');
	log.info('| Titanium Module (v.:' + _version + ')        |');
	log.info('| by Julio Conchas                  |');
	log.info('-------------------------------------');

    _prop.accessToken = null;
    _prop.refreshToken = null;
    _prop.tokenType = null;
    _prop.expiresIn = 0;

    prop = getProps();

    if(prop.expiresIn >= (new Date()).getTime()){
        log.info('GoogleAuth: Access code valid');
        _prop = prop;
    }
    function getProps(){
        var p = {};
        p.accessToken = Ti.App.Properties.getString(_opt.propertyName + '.accessToken');
        p.refreshToken = Ti.App.Properties.getString(_opt.propertyName + '.refreshToken');
        p.tokenType = Ti.App.Properties.getString(_opt.propertyName + '.tokenType');
        p.expiresIn = Ti.App.Properties.getString(_opt.propertyName + '.expiresIn');
        return p;
    }
    function authorize(cb){
        console.log("authorize function");
        var spinner;
        var close;
        var url;
        var webview;
        var c = 0;
        var code;

        cb = (cb) ? cb :function(){};
        win = Ti.UI.createWindow({
            backgroundColor : 'white',
            borColor:_opt.winColor,
            modal : true,
            title: _opt.winTitle
        });
        if(Ti.Platform.osname == 'android'){
            win.addEventListener('open',function(){
                win.activity.actionBar.hide();
            });
        }
        spinner = Ti.UI.createActivityIndicator({
            //animacion icono loading
            zIndex:1,
            height:50,
            hide:true,
            style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
        });
        win.add(spinner);
        //*Esto no sirver para nada
        //--------------------------------------------------
        close = Ti.UI.createButton({
            title: _opt.closeTitle
        });
        win.rightNavButton = close;

        close.addEventListener('click',function(){
            win.close();
        });
        //-------------------------------------------------
        url = prepareUrl();

        webview = Ti.UI.createWebView({
            width:'100%',
            height:'100%',
            url:url
        });
        win.add(webview);
        webview.addEventListener('load',function(e){
            c++;
            var accessDenied = webview.evalJS('document.getElementById("access_denied").value;');
            if(accessDenied != ''){
                log.debug('GoogleAuth: Access denied!');
                Ti.App.Properties.setString(_opt.propertyName + '.accessToken', '');
                Ti.App.Properties.setString(_opt.propertyName + '.refreshToken', '');
                Ti.App.Properties.setString(_opt.propertyName + 'tokenType', '');
                Ti.App.Properties.setString(_opt.propertyName + '.expiresIn', 0);
                _prop.accessToken = null;
                _prop.refreshToken = null;
                _prop.tokenType = null;
                _prop.expiresIn = 0;
                win.close();
            }
            code = webview.evalJS('document.getElementById("code").value;');
            if(code != ''){
                log.debug('GoogleAuth: Acces granted!');
                webview.hide();
                spinner.show();
                getToken(code,cb);
            }
            if(c > 10){
                //some error (to many requests:)
                log.debug('GoogleAuth: To many redirects...');
                win.close();
            }
        });
        win.open();
    }
    function deAuthorize(e){
        var logoutWin;
        var close;
        var spinner;
        var webview;

        e = (e) ? e : function(){};

        log.debug('GoogleAutho: User loggin out....');
        if(isAuthorized()){
            logoutWin = Ti.UI.createWindow({
                backgroundColor: 'white',
                barColor:_opt.winColor,
                modal:true,
                title:_opt.winTitle
            });
            close = Ti.UI.createButton({
                title:_opt.closeTitle
            });
            spinner = Ti.UI.createActivityIndiator({
                zIndex:1,
                height:50,
                width:50,
                style:Ti.UI.iPhone.ActyvityIndicatorStyle.DARK
            });
            logoutWin.rightNavButton = close;

            close.addEventListener('click',function(){
                logoutWin.close();
            });
            webview = Ti.UI.createWebView({
                width:'100%',
                height:'100%',
                url: 'https://accounts.google.com/Logout'
            });
            logoutWin.add(spinner);
            logoutWin.add(webview);
            webview.addEventListener('load',function(e){
                var t = setTimeout(function(){
                    logoutWin.close();
                    e();
                },500);
                Ti.App.Properties.setString(_opt.propertyName + '.accessToken','');
                Ti.App.Properties.setString(_opt.propertyName + '.refreshToken', '');
                Ti.App.Properties.setString(_opt.propertyName + '.tokenType', '');
                Ti.App.Properties.setString(_opt.propertyName + 'expiresIn',0);
                _prop.accessToken = null;
				_prop.refreshToken = null;
				_prop.tokenType = null;
				_prop.expiresIn = 0;
            });
            logoutWin.open();
        }
    }
    /**
    * Refresh token
    */
    function refreshToken(eSuccess,eError){
        var xhr;
        var resp;
        var d;
        log.info('GoogleAuth: Access code not valid. Regreshing....');
        eSuccess = (eSuccess) ? eSuccess : function(){};
        eError = (eError) ? eError : function(){};
        xhr = Ti.Network.createHTTPClient({
            //function called when the response data is available
            onload : function(e){
                resp = JSON.parse(this.responseText);
                resp.espires_in = parseFloat(resp.expires_in, 10) * 1000 + (new Date()).getTime();
                Ti.App.Properties.setString(_opt.propertyName + '.accessToken',resp.access_token);
                Ti.App.Properties.setString(_opt.propertyName + '.tokenType',resp.roken_type);
                Ti.App.Properties.setString(_opt.propertyName + '.expiresIn',resp.expires_in);
                _prop.accessToken = resp.access_token;
                _prop.tokenType = resp.token_type;
                _prop.expiresIn = resp.expires_in;
                log.debug(_porp);
                eSuccess();
            },
            //function called when an error accurs, including a timeout
            onerror: function(e){
                log.info(e.error);
                log.info(e.responseText);
                eError();
                //Error
                Ti.UI.createAlertDialog({
                    title:'Error',
                    message:_opt.errorText
                });
                eError();
            },
            timeout: 5000
        });
        //Prepare the connection.
        xhr.open("POST",_opt.url);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        d = {
            client_id:_opt.clientId,
            client_secret:_opt.clientSecret,
            refresh_token: _prop.refreshToken,
            grant_type: 'refresh_token'
        }
        //send the request.
        xhr.send(d);
    }
    /**
    *Get TOKEN
    */
    function getToken(code,cb){
        cb = (cb) ? cb : function(){};
        console.log("getting token");
        var xhr = Ti.Network.createHTTPClient({
            onload:function(e){
                var resp = JSON.parse(this.responseText);
                log.info(resp.expires_in);
                resp.expires_in = parseFloat(resp.expires_in,10) * 1000 + (new Date()).getTime();
                log.info(resp.expires_in);
                Ti.App.Properties.setString(_opt.propertyName + '.accessToken', resp.access_token);
                Ti.App.Properties.setString(_opt.propertyName + '.refreshToken',resp.refresh_token);
                Ti.App.Properties.setString(_opt.propertyName + '.tokenType', resp.token_type);
                Ti.App.Properties.setString(_opt.propertyName + '.expiresIn', resp.expires_in);
                _prop.accessToken = resp.access_token;
                _prop.refreshToken = resp.refresh_token;
                _prop.tokenType = resp.token_type;
                _prop.expiresIn = resp.expires_in;
                log.debug(_prop);
                win.close();
                cb();
            },
            onerror:function(e){
                Ti.UI.createAlerDialog({
                    title: 'Error',
                    message : _opt.errorText
                });
                win.close();
            },
            timeout: 5000
        });
        xhr.open("POST",'https://accounts.google.com/o/oauth2/token');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var d = {
			code : code,
			client_id : _opt.clientId,
			client_secret : _opt.clientSecret,
			redirect_uri : 'urn:ietf:wg:oauth:2.0:oob',
			grant_type : 'authorization_code'
		};
        xhr.send(d);
        //win.close();

    }
    /**
    *   Prepare url from options
    */
    function prepareUrl(){
        var scope = [];
        var url;
        for(var i = 0;i < _opt.scope.length;i++){
            scope[i] = encodeURIComponent(_opt.scope[i]);
        }
        url = _opt.url + '?' + 'approval_prompt=force&scope=' + scope.join('+') + '&' + 'redirect_uri=urn:ietf:wg:oauth:2.0:oob' + '&' +  'response_type=code' + '&' + 'client_id=' + _opt.clientId + '&' + 'btmpl=mobile' + '';
        log.debug(url);
        return url;
    }
    function isAuthorized(eSuccess,eError){
        eSuccess = (eSuccess) ? eSuccess : function(){};
        eError = (eError) ? eError : function(){};
        _prop = getProps();
        log.debug('Properties :): ' + JSON.stringify(_prop));
        if(_prop.accessToken != null && _prop.accessToken != ''){
            if(_prop.expiresIn < (new Date()).getTime()){
                refreshToken(eSuccess,eError);
            }
            else{
                eSuccess();
            }
            return true;
        }
        else{
            eError();
        }
        return false;
    }
    function getAccessToken(){
        return _prop.accessToken;
    }
    return {
        isAuthorized:isAuthorized,
        deAuthorize:deAuthorize,
        getAccessToken:getAccessToken,
        refreshToken:refreshToken,
        authorize:authorize,
        version:_version
    };

};
module.exports = GoogleAuth;

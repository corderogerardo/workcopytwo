angular.module('axpress')
.factory('Client', ['$rootScope', 'constants', '$q', '$http', '$timeout', 'Service', 'Facebook', 'Google',
function($rootScope, constants, $q, $http, $timeout, Service, Facebook, Google){

    var service = new Service('/client');
    service.user = {
        isLoged: false
    };

    service.login = function (username, password) {
        var data = {
            email: username,
            pass: password
        };
        return service.post('/login', data);
    };

    service.register = function (name, pass, email) {
        var data = {
            email: email,
            pass: pass,
            name: name
        };
        return service.post('/register', data);
    };

    
    service.loginWithFacebook = function () {
        Facebook.login().then(function () {
            service.facebookGetUserInfo('email,name');
        });
    };

    /**
     * We test the API access to fetch user basic info
     * such as userFacebookID, email and name
     */
    service.facebookGetUserInfo = function (fields) {
        Facebook.getUserInfo(fields).then(function (response) {
            $timeout(function(){
                $rootScope.user = service.user = response;
                console.log($rootScope.user);
            }, 0);
        });
    };

    /**
     * Logouts user from Facebook, cleaning session.
     */
    service.facebookLogout = function () {
        Facebook.logout().then(function () {
            $timeout(function() {
                $rootScope.user = service.user = {};
            }, 0);
        });
    };

    service.loginWithGoogle = function () {
        Google.login();
    };

    return service;
}]);;

angular.module('axpress')
.constant('constants', {
    //API base Url
    apiBaseUrl: 'http://52.43.247.174/api_devel',

    //App specific client token/key
    key: '1fc0f5604616c93deac481b33989f10e',

    //String to identify the App on the Admin Console
    platform: 'iOS Hybrid',
    
    //Facebook App ID
    fbAppId: '320049998373400',

    //Google App ID
    googleOAuthClientID: '96059222512-4vm97bgjdolu5i0fe0sg8tl35e85gjdm.apps.googleusercontent.com'
});;

angular.module('axpress')
.factory('Facebook', ['$rootScope', '$q', 'Service', '$window', 'constants', function($rootScope, $q, Service, $window, constants){
    var service = new Service();
    service.scope = 'email,public_profile';

    //Public methods
    service.loadFacebookSDK = loadFacebookSDK;
    service.login = login;
    service.getUserInfo = getUserInfo;
    service.logout = logout;
    service.registerFacebookAsyncInit = registerFacebookAsyncInit;

    return service;

    function registerFacebookAsyncInit () {
        /**
         * This method gets called when Facebook SDK loads
         */
        $window.fbAsyncInit = function () {
            FB.init({
                appId      : constants.fbAppId,
                cookie     : true,  // enable cookies to allow the server to access the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.6',

            });
            $rootScope.facebookLoaded = true;
        };
    }

    /**
     * Loads facebook sdk.
     *
     * @param      {Object}  d       Windows.Document object
     */
    function loadFacebookSDK (d, s, id) {
        registerFacebookAsyncInit();
        var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
    }

    /**
     * Starts the process of loggin in a user using
     * the Facebook SDK
     */
    function login () {
        if (typeof FB != 'undefined') {
            var deferred = $q.defer();
            FB.login(function (response) {
                if (response.authResponse) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response);
                }
            }, {scope: service.scope});
            return deferred.promise;
        }
    }

    /**
     * Gets user information from Facebook profile
     *
     * @param      {String}  fields  The fields we want to fetch
     *                               from user profile
     * @return     {Promise}  The promise that will resolve the
     *                            user information
     */
    function getUserInfo (fields) {
        var deferred = $q.defer();
        FB.api('/me', {fields: fields}, function (response) {
            if (!response || response.error) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }

    /**
     * Removes the facebook session
     */
    function logout () {
        var deferred = $q.defer();
        FB.logout(function (response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }
}]);;

angular.module('axpress')
.factory('Google', ['$rootScope', '$window', 'Service', 'constants', function($rootScope, $window, Service, constants){
    var service = new Service();
    var GoogleAuth = undefined;

    service.loadGoogleSDK = loadGoogleSDK;
    service.login = login;

    $window.onLoadGoogle = function () {
        gapi.load('auth2', function () {
            GoogleAuth = gapi.auth2.init({
                client_id:constants.googleOAuthClientID,
                scope: 'profile email'
            });
        });
    };

    return service;

    function loadGoogleSDK (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id; js.async = true; js.defer = true;
            js.src = "//apis.google.com/js/platform.js?onload=onLoadGoogle";
            fjs.parentNode.insertBefore(js, fjs);
    }

    function login (options) {
        options = options || {
            scope: 'profile email'
        };
        GoogleAuth.signIn(options).then(function (user) {
            console.log("sign in resolved...");
            console.log(user);
        }, function (error) {
            console.log("signIn error...");
            console.log(error);
        });
    }


}]);;

angular.module('axpress')
.factory('Service', ['$http', 'constants', '$q', function($http, constants, $q){

    var baseOptions = {
        headers: {
            'Content-Type' : 'application/json'
        }
    };

    /**
     * Class to be instantiated as a base service with common configurations
     *
     * @class      Service (name)
     * @param      {String}  urlSufix  The url sufix of the service
     */
    var Service = function (urlSufix) {
        this.url = constants.apiBaseUrl;
        this.urlSufix = urlSufix || '';
        this.key = constants.key;
        this.platform = constants.platform;

        /**
         * Returns full base path url, useful when using services with common api path
         * Just needs to add remaining part of api path for specific service query
         *
         * @return     {String}  Full base path to service
         */
        this.urlBase = function () {
            return this.url + this.urlSufix;
        };

        /**
         * Reusable function to make queries and consume service from the server
         *
         * @param      {String}  path     The path specific to the service
         * @param      {Object}  data     The data to be sent using the service
         * @param      {Object}  options  The $http options for the service (Optional)
         * @return     {Promise}  Returns the $http promise to be resolved on success or error
         */
        this.post = function (path, data, options) {
            data = data || {};
            data.key = this.key;
            data.platform = this.platform;

            var deferred = $q.defer();
            $http.post(this.urlBase() + path, data, options || baseOptions)
            .then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    };
    return Service;
}]);
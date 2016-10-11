angular.module('axpress')
.factory('Client', ['constants', '$q', '$http', function(constants, $q, $http){
    var api = constants.apiBaseUrl + '/client';
    var service = {};

    service.login = function (username, password) {
        var deferred = $q.defer();
        var data = {
            email: username,
            pass: password,
            key: constants.key,
            platform: constants.platform
        };
        $http.post(api + '/login', data, {})
        .then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        });
    };

    return service;
}]);;

angular.module('axpress')
.constant('constants', {
    apiBaseUrl: 'http://52.43.247.174/api_devel',
    key: '21569d3e6977ae51178544f5dcdd508652799af3.IVadPml3rlEXhUT13N1QhlJ5mvM=',
    platform: 'iOS Hybrid'
});
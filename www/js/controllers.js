/**
 * @summary HistoryController
 *
 */
angular.module('axpress')
.controller('HistoryController', ['$scope', function($scope){

	$scope.groups = [
		{
			"id": 1,
			"name": "DOCUMENTOS",
			"fecha": "30 - 09 - 2016",
			"iconURL": "http://ionicframework.com/img/docs/venkman.jpg"
		},
		{
			"id": 2,
			"name": "PAQUETES",
			"fecha": "30 - 09 - 2016",
			 "iconURL": "http://ionicframework.com/img/docs/barrett.jpg"
		}
		];

		$scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		// $ionicScrollDelegate.resize();
	};

	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};


}]);;

angular.module('axpress')
.controller('loginController', ['$scope', 'Client', function($scope, Client){
    $scope.login = function () {
        Client.login('reinaldo122@gmail.com','123123')
        .then(function (data) {
            console.log(data);
        }, function (error) {
            console.warn("error...");
            console.log(error);
        });
    };
}]);
(function() {
		angular.module('axpress')
				.controller('ResumeController', ResumeController);

		ResumeController.$inject = ['$rootScope', '$scope', '$state', 'Logger', 'Shipping', 'Diligence', 'Util'];

		function ResumeController($rootScope, $scope, $state, Logger, Shipping, Diligence, Util) {

				activate();

				$scope.editOrigin = function() {
						$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
						Util.stateGoAndReload($scope.extraData.flow + '.origin');
				};

				$scope.editDestiny = function() {
						if ( $state.params.serviceType == 45 ) {
								//Its a diligence
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.stops');
						} else {
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.destiny');
						}
				};
				$scope.editSentType = function() {
						if ( $state.params.serviceType == 45 ) {
								//Its a diligence
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.features');
						} else {
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.features');
						}
				};
				$scope.editPackages = function() {
						if ( $state.params.serviceType == 45 ) {
								//Its a diligence
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.package');
						} else {
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.package');
						}
				};
				$scope.editPhoto = function() {
						if ( $state.params.serviceType == 45 ) {
								//Its a diligence
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.photo');
						} else {
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.photo');
						}
				};

				$scope.editFeatures = function() {
						if ( $state.params.serviceType == 45 ) {
								//Its a diligence
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.clientfeatures');
						} else {
								$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
								Util.stateGoAndReload($scope.extraData.flow + '.features');
						}
				};

				$scope.editDestinatary = function() {
						$scope.extraData.navigateTo = $scope.extraData.flow + '.resume';
						Util.stateGoAndReload($scope.extraData.flow + '.receiver');
				};

				$scope.confirmResume = function() {
						Util.stateGoAndReload($scope.extraData.resumeNext);
				};

				function requestQuotation() {
						Shipping.quotation($scope.data.originLatitude, $scope.data.originLongitude,
								$scope.data.destinyLatitude, $scope.data.destinyLongitude, $state.params.serviceType, $scope.data.bagId)
								.then(function(response) {
										if ( response.return && response.status == 200 ) {
												quotationSuccessful(response.data);
										}
								}, function(error) {
										if ( error.message )
												Logger.error(error.message);
										else
												Logger.error('');
								});
				}

				function quotationSuccessful(response) {
						$scope.data.quotation = response;
						$scope.data.amount = response.price;
						$scope.data.distance = ($state.params.serviceType == 45 ? Number(response.km) * 1000 : response.meters_text);
				}

				function requestQuotationDiligence() {
						Diligence.quotation($state.params.serviceType, $scope.data.samepoint, $scope.data.destiniesData, $scope.data.originLatitude, $scope.data.originLongitude)
								.then(function(response) {
										if ( response.return && response.status == 200 ) {
												quotationSuccessful(response.data);
										}
								}, function(error) {
										if ( error.message )
												Logger.error(error.message);
										else
												Logger.error('');
								});
				}

				function activate() {
						$scope.data = $state.current.data.data;
						$scope.extraData = $state.current.data.extraData;
						if ( $state.params.serviceType == 45 ) {
								//Its a diligence
								requestQuotationDiligence();
						} else {
								requestQuotation();
						}
				}
		}
})();

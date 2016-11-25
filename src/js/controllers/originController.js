(function() {
    angular.module('axpress')
        .controller('OriginController', DocumentOriginController);

    DocumentOriginController.$inject = ['$rootScope', '$scope', '$state', 'Location', 'NgMap',
        '$timeout', 'GoogleMapGeocoder'];

    function DocumentOriginController($rootScope, $scope, $state, Location, NgMap,
                                      $timeout, GoogleMapGeocoder) {
        activate();

        $scope.placeChanged = function(place) {
            $scope.place = (typeof place == "object" ? place : this.getPlace());
            $timeout(function() {
                $scope.markers[0].position = $scope.place.geometry.location;
            }, 0);
            if ( typeof place == "object" )
                $scope.address = $scope.place.formatted_address;
        };

        $scope.pickHere = function() {
            $scope.buttonState = true;
            $scope.markers[0].icon = "{url: 'img/PinOrigen/Origenmdpi.png', scaledSize: [28,38]}";
        };

        $scope.confirmOrigin = function() {
            $scope.data.originAddress = $scope.place.formatted_address;
            $scope.data.originLatitude = $scope.place.geometry.location.lat();
            $scope.data.originLongitude = $scope.place.geometry.location.lng();
            $scope.data.originPlace = $scope.place;
            if ( $scope.extraData.navigateTo ) {
                $state.go($scope.extraData.navigateTo);
                delete $scope.extraData.navigateTo;
            } else {
                $state.go($scope.extraData.originNext);
            }
        };

        /**
         * For GPS Geolocation
         **/
        $scope.gpsHere = function() {
            Location.getCurrentPosition()
                .then(function(pos) {
                    GoogleMapGeocoder.reverseGeocode(pos)
                        .then(geocoderCallback);
                })
        };

        $scope.mapCallbacks = {
            mapTapped    : mapTap,
            markerDragend: markerDraged
        };

        function geocoderCallback(results) {
            $scope.placeChanged(results[0]);
            setMapCenter(results[0].geometry.location);
        }

        function markerDraged(marker) {
            var latlng = { lat: marker.latLng.lat(), lng: marker.latLng.lng() };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function setMapCenter(position) {
            $scope.map.setCenter(position);
        }

        function mapTap(event) {
            var latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function setExistingAddress() {
            var latlng = { lat: $scope.data.originLatitude, lng: $scope.data.originLongitude };
            GoogleMapGeocoder.reverseGeocode(latlng)
                .then(geocoderCallback);
        }

        function initialUIStates() {
            $scope.focused = false;
            $scope.focused2 = false;
            $scope.buttonState = false;
        }

        function activate() {
            $scope.data = $state.current.data.data;
            $scope.extraData = $state.current.data.extraData;
            initialUIStates();
            $scope.markers = [{
                title    : 'Origen',
                icon     : "{url: 'img/PinOrigen/Origenmdpi.png', scaledSize: [28,38]}",
                draggable: true
            }];
            if ( $scope.data.originAddress )
                setExistingAddress();
            NgMap.getMap().then(function(map) {
                $scope.map = map;
            });

        }
    }
})();

var app = app || {};

(function ($) {
    app.MapView = Backbone.View.extend({
        id: 'map-canvas',

        mapOptions: {
            zoom: 15,
            keyboardShortcuts: false,
            panControl: false,
            rotateControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },

        defaultLatLng: {
            lat: 53.902257,
            lng: 27.561640
        },

        markersArray: [],
        serverUrl: 'http://atmnav-server.appspot.com',

        initialize: function () {
            var latLng = app.utils.loadData('mapLastLocation');

            if (!latLng) {
                latLng = this.defaultLatLng;
            }

            this.mapOptions.center = new google.maps.LatLng(latLng.lat, latLng.lng);
            this.map = new google.maps.Map(this.el, this.mapOptions);

            this.customizeMap();

            var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var currentPositionLatLng = new google.maps.LatLng(lat, lng);

                    self.fetchMarkers();

                    self.map.setCenter(currentPositionLatLng);
                    self.createCurrentPositionMarker(currentPositionLatLng);

                    app.utils.saveData('mapLastLocation', {lat: lat, lng: lng});
                });
            }
        },

        customizeMap: function () {
            var currentLocationControl = document.createElement('div');
            currentLocationControl.id = 'currentLocationControl';

            var self = this;
            google.maps.event.addDomListener(currentLocationControl, 'click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var currentPositionLatLng = new google.maps.LatLng(lat, lng);

                    self.map.setCenter(currentPositionLatLng);

                    app.utils.saveData('mapLastLocation', {lat: lat, lng: lng});
                });
            }
            });

            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(currentLocationControl);            
        },

        createMarker: function (args, markersArray) {
            var marker = new google.maps.Marker(args);

            markersArray = markersArray || this.markersArray;
            markersArray.push(marker);
        },

        createCurrentPositionMarker: function (latLng) {
            if (this.currentPositionMarker) {
                this.currentPositionMarker.setMap(null);
            }

            this.currentPositionMarker = new google.maps.Marker({
                map: this.map,
                position: latLng,
            });
        },

        deleteMarkers: function () {
            _.each(this.markersArray, function (marker) {
                marker.setMap(null);
            });

            this.markersArray = [];
        },

        onFetchError: function () {
            alert('Невозможно загрузить данные с сервера. Попробуйте позже.');
        },

        onFetchSuccess: function (data) {
            this.deleteMarkers();

            var map = this.map;
            var markersArray = this.markersArray;
            var createMarker = this.createMarker;
            _.each(JSON.parse(data), function (markerData) {
                createMarker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(markerData.lat, markerData.lng)
                }, markersArray);
            })
        },

        fetchMarkers: function (args) {
            var selectedObjects = app.utils.loadArrayData('objects');
            var selectedFilters = app.utils.loadArrayData('filters');

            if (!selectedObjects.length || !selectedFilters.length) {
                console.log('no selected filters or selected objects, abort fetching');
                this.deleteMarkers();
                return;
            }

            if (this.lastSelectedObjects && this.lastSelectedFilters &&
                !_.difference(selectedObjects, this.lastSelectedObjects).length &&
                !_.difference(selectedFilters, this.lastSelectedFilters).length) {
                console.log('selected filters and objects not changed, abort fetching');
                return;
            }

            var params = {
                'filters[]': selectedFilters,
                'objects[]': selectedObjects
            }

            if (args && args.lat && args.lng) {
                params.lat = args.lat;
                params.lng = args.lng;
            }

            var self = this;
            var jqxhr = jQuery.get(this.serverUrl, params, function (data) {
                self.onFetchSuccess(data);
            });
            jqxhr.error(this.onFetchError);

            this.lastSelectedObjects = selectedObjects;
            this.lastSelectedFilters = selectedFilters;
        },

        updateMarkers: function () {
            var mapCenter = this.map.getCenter();

            this.fetchMarkers({
                lat: mapCenter.lat(),
                lng: mapCenter.lng()
            });
        }
    });
})(jQuery);
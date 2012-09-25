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
                animation: google.maps.Animation.BOUNCE
            });

            /*
            var self = this;
            setTimeout(function () {
                self.currentPositionMarker.setAnimation(null);
            }, 4000);
            */
        },

        deleteMarkers: function () {
            _.each(this.markersArray, function (marker) {
                marker.setMap(null);
            });

            this.markersArray = [];
        },

        onFetchError: function (jqXHR, textStatus, errorThrown) {
            //TODO: log errors here

            alert('Невозможно загрузить данные с сервера. Попробуйте позже.');
        },

        onFetchSuccess: function (data, textStatus, jqXHR) {
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
            jQuery.ajax({
                url: this.serverUrl,
                method: 'GET',
                data: params,
                error: function (jqXHR, textStatus, errorThrown) {
                    self.onFetchError(jqXHR, textStatus, errorThrown);
                },
                success: function (data, textStatus, jqXHR) {
                    self.onFetchSuccess(data, textStatus, jqXHR);
                }
            });
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
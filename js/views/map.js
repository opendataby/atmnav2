var app = app || {};

(function ($) {
    app.MapView = Backbone.View.extend({
        id: 'map-canvas',

        markersArray: [],
        infoWindow: new google.maps.InfoWindow(),

        initialize: function () {
            app.utils.log('map:initialize');

            var latLng = app.utils.loadData('mapLastLocation');

            if (!latLng) {
                latLng = app.settings.defaultLatLng;
            }

            app.settings.mapOptions.center = new google.maps.LatLng(latLng.lat, latLng.lng);
            this.map = new google.maps.Map(this.el, app.settings.mapOptions);

            this.addMapControls();
            this.addMapEvents();

            var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    self.onGeolocationSuccess(self, position);
                    
                    self.createCurrentPositionMarker(new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    ));

                    self.fetchMarkers();
                    
                }, this.onGeolocationError, app.settings.geolocationOptions);
            }
        },

        onGeolocationSuccess: function (self, position) {
            app.utils.log('map:onGeolocationSuccess');

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            self.map.setCenter(new google.maps.LatLng(lat, lng));

            setTimeout(function () {
                app.utils.saveData('mapLastLocation', {lat: lat, lng: lng});    
            }, 0);
        },

        onGeolocationError: function () {
            app.utils.log('map:onGeolocationError');

            alert('Невозможно определить текущее местоположение');
        },

        addMapControls: function () {
            app.utils.log('map:addMapControls');

            var currentLocationControl = document.createElement('div');
            currentLocationControl.id = 'currentLocationControl';

            var self = this;
            google.maps.event.addDomListener(currentLocationControl, 'click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        self.onGeolocationSuccess(self, position);
                    }, this.onGeolocationError, app.settings.geolocationOptions);
                }
            });

            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(currentLocationControl);  
        },

        addMapEvents: function () {
            app.utils.log('map:addMapEvents');

            var self = this;

            google.maps.event.addListener(this.map, 'click', function() {
                self.infoWindow.close();
            });
        },

        createMarker: function (args, markersArray) {
            var marker = new google.maps.Marker(args);

            markersArray = markersArray || this.markersArray;
            markersArray.push(marker);

            return marker;
        },

        createCurrentPositionMarker: function (latLng) {
            app.utils.log('map:createCurrentPositionMarker');

            if (this.currentPositionMarker) {
                this.currentPositionMarker.setMap(null);
            }

            this.currentPositionMarker = new google.maps.Marker({
                map: this.map,
                position: latLng,
            });
        },

        deleteMarkers: function () {
            app.utils.log('map:deleteMarkers');

            _.each(this.markersArray, function (marker) {
                marker.setMap(null);
            });

            this.markersArray = [];
        },

        connectMarkerHandlers: function (markers, data) {
            app.utils.log('map:connectMarkerHandlers');

            var self = this;
            var infoWindow = this.infoWindow;
            var addListener = google.maps.event.addListener;
            var infoWindowTemplate = _.template($('#info-window-template').html());

            _.each(markers, function (marker, index) {
                addListener(marker, 'click', function () {
                    var templateContext = data[index];
                    templateContext.type = app.settings.types[templateContext.type];
                    templateContext.title = app.settings.objects[templateContext.prov];

                    infoWindow.close();
                    infoWindow.setOptions({
                        maxWidth: screen.width / 7 * 5
                    });
                    infoWindow.setContent(infoWindowTemplate(templateContext));
                    infoWindow.open(self.map, marker);
                });
            });
        },

        onFetchError: function () {
            app.utils.log('map:onFetchError');

            alert('Невозможно загрузить данные с сервера. Попробуйте позже.');
        },

        onFetchSuccess: function (data) {
            app.utils.log('map:onFetchSuccess');

            this.deleteMarkers();

            var map = this.map;
            var data = JSON.parse(data);
            var markersArray = this.markersArray;
            var createMarker = this.createMarker;

            _.each(data, function (markerData) {
                createMarker({
                    map: map,
                    icon: markerData.type + '.png',
                    position: new google.maps.LatLng(markerData.lat, markerData.lng)
                }, markersArray);
            })

            this.connectMarkerHandlers(markersArray, data);
        },

        fetchMarkers: function (args) {
            app.utils.log('map:fetchMarkers');

            var selectedObjects = app.utils.loadArrayData('objects');
            var selectedFilters = app.utils.loadArrayData('filters');

            if (!selectedObjects.length || !selectedFilters.length) {
                console.log('no selected filters or selected objects, abort fetching');
                this.deleteMarkers();
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
            var jqxhr = jQuery.get(app.settings.serverUrl, params, function (data) {
                self.onFetchSuccess(data);
            });
            jqxhr.error(this.onFetchError);
        },

        updateMarkers: function () {
            app.utils.log('map:updateMarkers');

            var mapCenter = this.map.getCenter();

            this.fetchMarkers({
                lat: mapCenter.lat(),
                lng: mapCenter.lng()
            });
        }
    });
})(jQuery);
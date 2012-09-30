var app = app || {};

(function ($) {
    app.MapView = Backbone.View.extend({
        id: 'map-canvas',

        markersArray: [],

        initialize: function () {
            app.utils.log('map:initialize:start');

            this.infoWindow = new google.maps.InfoWindow();
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

            app.utils.log('map:initialize:end');
        },

        onGeolocationSuccess: function (self, position) {
            app.utils.log('map:onGeolocationSuccess:start');

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            self.map.setCenter(new google.maps.LatLng(lat, lng));
            app.utils.saveData('mapLastLocation', {lat: lat, lng: lng});    

            app.utils.log('map:onGeolocationSuccess:end');
        },

        onGeolocationError: function () {
            app.utils.log('map:onGeolocationError');

            alert('Невозможно определить текущее местоположение');
        },

        addMapControls: function () {
            app.utils.log('map:addMapControls:start');

            var self = this;            

            var currentLocationControl = document.createElement('div');
            currentLocationControl.id = 'currentLocationControl';

            google.maps.event.addDomListener(currentLocationControl, 'click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        self.onGeolocationSuccess(self, position);
                    }, this.onGeolocationError, app.settings.geolocationOptions);
                }
            });

            var addNewPointControl = document.createElement('div');
            addNewPointControl.id = 'addNewPointControl';

            google.maps.event.addDomListener(addNewPointControl, 'click', function() {
                app.Router.navigate('#create', true);
            });

            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(currentLocationControl);
            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(addNewPointControl);  

            app.utils.log('map:addMapControls:end');
        },

        addMapEvents: function () {
            app.utils.log('map:addMapEvents:start');

            var self = this;
            google.maps.event.addListener(this.map, 'click', function() {
                self.infoWindow.close();
            });

            app.utils.log('map:addMapEvents:end');
        },

        createMarker: function (args, markersArray) {
            var marker = new google.maps.Marker(args);

            markersArray = markersArray || this.markersArray;
            markersArray.push(marker);

            return marker;
        },

        createCurrentPositionMarker: function (latLng) {
            app.utils.log('map:createCurrentPositionMarker:start');

            if (this.currentPositionMarker) {
                this.currentPositionMarker.setMap(null);
            }

            this.currentPositionMarker = new google.maps.Marker({
                map: this.map,
                position: latLng,
            });

            app.utils.log('map:createCurrentPositionMarker:end');
        },

        deleteMarkers: function () {
            app.utils.log('map:deleteMarkers:start');

            _.each(this.markersArray, function (marker) {
                marker.setMap(null);
            });

            this.markersArray = [];

            app.utils.log('map:deleteMarkers:end');
        },

        connectMarkerHandlers: function (markers, data) {
            app.utils.log('map:connectMarkerHandlers:start');

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

            app.utils.log('map:connectMarkerHandlers:end');
        },

        onFetchError: function () {
            app.utils.log('map:onFetchError');

            alert('Невозможно загрузить данные с сервера. Попробуйте позже.');
        },

        onFetchSuccess: function (data) {
            app.utils.log('map:onFetchSuccess:start');

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

            app.utils.log('map:onFetchSuccess:end');
        },

        fetchMarkers: function (args) {
            app.utils.log('map:fetchMarkers:start');

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

            app.utils.log('map:fetchMarkers:end');
        },

        updateMarkers: function () {
            app.utils.log('map:updateMarkers:start');

            var mapCenter = this.map.getCenter();

            this.fetchMarkers({
                lat: mapCenter.lat(),
                lng: mapCenter.lng()
            });

            app.utils.log('map:updateMarkers:end');
        }
    });
})(jQuery);
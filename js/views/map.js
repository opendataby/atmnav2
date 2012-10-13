app.MapView = app.PageView.extend({
    className: 'nt-map-page',

    markersArray: [],

    map: null,
    infoWindow: null,
    currentPositionMarker: null,

    initialize: function () {
        app.utils.log('map:initialize:start');

        this.infoWindow = new google.maps.InfoWindow();
        var latLng = app.utils.loadData('mapLastLocation') || app.settings.defaultLatLng;
        app.settings.mapOptions.center = new google.maps.LatLng(latLng.lat, latLng.lng);
        this.map = new google.maps.Map(this.el, app.settings.mapOptions);

        this.addMapControls();
        this.addMapEvents();
        this.moveToLocation(true);

        app.utils.log('map:initialize:end');
    },

    attach: function (container) {
        app.PageView.prototype.attach.call(this, container);
        this.updateMarkers();
        return this;
    },

    onGeolocationSuccess: function (position) {
        app.utils.log('map:onGeolocationSuccess:start');

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latLng = new google.maps.LatLng(lat, lng);

        this.createOrUpdateCurrentPositionMarker(latLng);
        this.map.setCenter(latLng);
        app.utils.saveData('mapLastLocation', {lat: lat, lng: lng});

        app.utils.log('map:onGeolocationSuccess:end');
    },

    onGeolocationError: function () {
        app.utils.log('map:onGeolocationError');

        alert('Невозможно определить текущее местоположение');
    },

    moveToLocation: function (fetchMarkers) {
        var self = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                self.onGeolocationSuccess(position);
                if (fetchMarkers) {
                    self.fetchMarkers();
                }
            }, this.onGeolocationError, app.settings.geolocationOptions);
        }
    },

    addMapControls: function () {
        app.utils.log('map:addMapControls:start');

        var self = this;
        this.addMapControl('current-location-icon', function () {
            self.moveToLocation(false);
        }, google.maps.ControlPosition.TOP_LEFT);
        this.addMapControl('add-point-icon', function () {
            app.router.navigate('#create');
        }, google.maps.ControlPosition.TOP_LEFT);

        app.utils.log('map:addMapControls:end');
    },

    addMapControl: function (className, handler, position) {
        position = position || google.maps.ControlPosition.TOP_LEFT;
        var control = document.createElement('div');
        control.className = 'nt-map-control-wrapper';
        control.innerHTML = '<div class="nt-map-control-button">' +
            '<div class="nt-map-control-icon ' + className + '"></div></div>';
        google.maps.event.addDomListener(control, 'click', handler);
        this.map.controls[position].push(control);
    },

    addMapEvents: function () {
        app.utils.log('map:addMapEvents:start');

        var self = this;
        google.maps.event.addListener(this.map, 'click', function() {
            self.infoWindow.close();
        });

        app.utils.log('map:addMapEvents:end');
    },

    createOrUpdateCurrentPositionMarker: function (latLng) {
        app.utils.log('map:createOrUpdateCurrentPositionMarker:start');

        if (!this.currentPositionMarker) {
            this.currentPositionMarker = new google.maps.Marker({
                map: this.map
            });
        }
        this.currentPositionMarker.setPosition(latLng);

        app.utils.log('map:createOrUpdateCurrentPositionMarker:end');
    },

    deleteMarkers: function () {
        app.utils.log('map:deleteMarkers:start');

        _.each(this.markersArray, function (marker) {
            marker.setMap(null);
        });
        this.markersArray = [];

        app.utils.log('map:deleteMarkers:end');
    },

    onFetchError: function () {
        app.utils.log('map:onFetchError');

        alert('Невозможно загрузить данные с сервера. Попробуйте позже.');
    },

    onFetchSuccess: function (data) {
        app.utils.log('map:onFetchSuccess:start');

        this.deleteMarkers();

        var map = this.map;
        var infoWindow = this.infoWindow;
        var parsedData = JSON.parse(data);
        var markersArray = this.markersArray;
        var Marker = google.maps.Marker;
        var LatLng = google.maps.LatLng;
        var addListener = google.maps.event.addListener;
        var infoWindowTemplate = _.template($('#info-window-template').html());

        _.each(parsedData, function (markerData) {
            var marker = new Marker({
                map: map,
                icon: markerData.type + '.png',
                position: new LatLng(markerData.lat, markerData.lng)
            });
            addListener(marker, 'click', function () {
                var templateContext = parsedData[index];
                templateContext.type = app.settings.types[templateContext.type];
                templateContext.title = app.settings.objects[templateContext.prov];

                infoWindow.close();
                infoWindow.setOptions({
                    maxWidth: screen.width / 7 * 6
                });
                infoWindow.setContent(infoWindowTemplate(templateContext));
                infoWindow.open(map, marker);
            });
            markersArray.push(marker);
        });

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
        };

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
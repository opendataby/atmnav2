app.MapView = app.PageView.extend({
    className: 'nt-map-page',

    markersArray: [],

    map: null,
    infoWindow: null,
    currentPositionMarker: null,

    initialize: function() {
        app.utils.log('map:initialize:start');

        var latLng = app.utils.loadData('mapLastLocation') || app.settings.defaultLatLng;
        var map = this.map = L.map(this.el, _.extend(app.settings.mapOptions, {center: latLng}));
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        this.addMapControls();
        this.addMapEvents();
        this.moveToLocation();

        app.utils.log('map:initialize:end');
    },

    attach: function(container) {
        app.utils.log('map:attach:start');

        app.PageView.prototype.attach.call(this, container);
        this.map.invalidateSize();
        this.updateMarkers();

        app.utils.log('map:attach:end');
        return this;
    },

    onGeolocationSuccess: function(position) {
        app.utils.log('map:onGeolocationSuccess:start');

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latLng = [lat, lng];

        $('.locate-icon').removeClass('loading-icon');
        this.createOrUpdateCurrentPositionMarker(latLng);
        this.map.panTo(latLng);
        app.utils.saveData('mapLastLocation', latLng);

        app.utils.log('map:onGeolocationSuccess:end');
    },

    onGeolocationError: function() {
        app.utils.log('map:onGeolocationError');

        $('.locate-icon').removeClass('loading-icon');
        alert('Невозможно определить текущее местоположение');
    },

    moveToLocation: function() {
        app.utils.log('map:moveToLocation:start');

        var self = this;
        if (navigator.geolocation) {
            $('.locate-icon').addClass('loading-icon');
            navigator.geolocation.getCurrentPosition(function(position) {
                self.onGeolocationSuccess(position);
            }, this.onGeolocationError, app.settings.geolocationOptions);
        }

        app.utils.log('map:moveToLocation:end');
    },

    addMapControl: function(title, position, className, handler, context) {
        var Control = L.Control.extend({
            onAdd: function (map) {
                var button = L.DomUtil.create('a',
                    'nt-map-control-button ' + (L.Browser.mobile ? 'mobile ': '') + className);
                button.href = '#';
                button.title = title;

                L.DomEvent
                    .on(button, 'click', L.DomEvent.stopPropagation)
                    .on(button, 'click', L.DomEvent.preventDefault)
                    .on(button, 'click', handler, context || map)
                    .on(button, 'dblclick', L.DomEvent.stopPropagation);

                return button;
            }
        });

        this.map.addControl(new Control({position: position}));
    },

    addMapControls: function() {
        app.utils.log('map:addMapControls:start');

        var self = this;
        if (L.Browser.mobile) {
            this.addMapControl('Locate', 'topright', 'locate-icon', self.moveToLocation, self);
            this.addMapControl('Zoom Out', 'bottomright', 'zoom-out-icon', this.map.zoomOut);
            this.addMapControl('Zoom In', 'bottomright', 'zoom-in-icon', this.map.zoomIn);
        } else {
            this.addMapControl('Zoom In', 'topleft', 'zoom-in-icon', this.map.zoomIn);
            this.addMapControl('Zoom Out', 'topleft', 'zoom-out-icon', this.map.zoomOut);
            this.addMapControl('Locate', 'topleft', 'locate-icon', self.moveToLocation, self);
        }

        app.utils.log('map:addMapControls:end');
    },

    addMapEvents: function() {
        app.utils.log('map:addMapEvents:start');

        var map = this.map;
        map.on('popupclose', function(event) {
            var marker = event.popup.options.marker;
            if (marker) {
                marker.setOpacity(1);
                map.invalidateSize();
            }
        });

        app.utils.log('map:addMapEvents:end');
    },

    createOrUpdateCurrentPositionMarker: function(latLng) {
        app.utils.log('map:createOrUpdateCurrentPositionMarker:start');

        if (!this.currentPositionMarker) {
            var map = this.map;
            var currentLocationTemplate = _.template($('#current-location-template').html());
            this.currentPositionMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'css/img/marker-location.png',
                    iconSize: [31, 42],
                    iconAnchor: [16, 40]
                })
            }).on('click', function () {
                L.popup({
                    marker: this,
                    closeButton: false,
                    maxWidth: 260,
                    minWidth: 260
                }).setLatLng(this.getLatLng()).setContent(currentLocationTemplate()).openOn(map);
            }).addTo(map);
        }
        this.currentPositionMarker.setLatLng(latLng);

        app.utils.log('map:createOrUpdateCurrentPositionMarker:end');
    },

    deleteMarkers: function() {
        app.utils.log('map:deleteMarkers:start');

        var map = this.map;
        _.each(this.markersArray, function(marker) {
            map.removeLayer(marker);
        });
        this.markersArray = [];

        app.utils.log('map:deleteMarkers:end');
    },

    onFetchError: function() {
        app.utils.log('map:onFetchError');

        alert('Невозможно загрузить данные с сервера. Попробуйте позже.');
    },

    onFetchSuccess: function(data) {
        app.utils.log('map:onFetchSuccess:start');

        var map = this.map;
        var parsedData = JSON.parse(data);
        var markersArray = this.markersArray;
        var currentPosition = this.currentPositionMarker ? this.currentPositionMarker.getLatLng() : null;
        var infoWindowTemplate = this.infoWindowTemplate = this.infoWindowTemplate || _.template($('#info-window-template').html());
        var showInfoWindow = this.showInfoWindow;

        _.each(parsedData, function (markerData) {
            var marker = L.marker([markerData.lat, markerData.lng], {
                icon: L.icon({
                    iconUrl: 'img/markers/' + markerData.prov + '.png',
                    iconSize: [37, 42],
                    iconAnchor: [19, 40]
                }),
                map: map,
                markerData: markerData,
                currentPosition: currentPosition,
                infoWindowTemplate: infoWindowTemplate
            }).on('click', showInfoWindow).addTo(map);
            markersArray.push(marker);
        });

        app.utils.log('map:onFetchSuccess:end');
    },

    showInfoWindow: function() {
        app.utils.log('map:showInfoWindow:start');

        var options = this.options;
        var markerData = options.markerData;
        var currentPosition = options.currentPosition;

        markerData.type = app.settings.types[markerData.type];
        markerData.title = app.settings.objects[markerData.prov];
        var markerLatLng = this.getLatLng();
        if (currentPosition) {
            markerData.distance = app.utils.roundDistance(currentPosition.distanceTo(markerLatLng));
        }

        this.setOpacity(0);
        L.popup({
            marker: this,
            closeButton: false,
            maxWidth: 260,
            minWidth: 260
        }).setLatLng(markerLatLng).setContent(options.infoWindowTemplate(markerData)).openOn(options.map);

        app.utils.log('map:showInfoWindow:end');
    },

    fetchMarkers: function(args) {
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

    updateMarkers: function() {
        app.utils.log('map:updateMarkers:start');

        this.fetchMarkers(this.map.getCenter());

        app.utils.log('map:updateMarkers:end');
    }
});
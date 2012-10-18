app.MapView = app.PageView.extend({
    className: 'nt-map-page',

    markersArray: [],

    map: null,
    infoWindow: null,
    currentPositionMarker: null,

    initialize: function () {
        app.utils.log('map:initialize:start');

        var latLng = app.utils.loadData('mapLastLocation') || app.settings.defaultLatLng;
        var map = this.map = L.map(this.el, _.extend(app.settings.mapOptions, {center: latLng}));
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        this.addMapControls();
        this.addMapEvents();
        this.moveToLocation(true);

        app.utils.log('map:initialize:end');
    },

    attach: function (container) {
        app.PageView.prototype.attach.call(this, container);
        this.map.invalidateSize();
        this.updateMarkers();
        return this;
    },

    onGeolocationSuccess: function (position) {
        app.utils.log('map:onGeolocationSuccess:start');

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latLng = [lat, lng];

        this.createOrUpdateCurrentPositionMarker(latLng);
        this.map.panTo(latLng);
        app.utils.saveData('mapLastLocation', latLng);

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
        var Controls = L.Control.Zoom.extend({
            onAdd: function (map) {
                var container = L.Control.Zoom.prototype.onAdd.call(this, map);

                this._createButton('Locate', 'current-location-icon', container, function () {
                    self.moveToLocation(false);
                }, map);
                this._createButton('Add item', 'add-point-icon', container, function () {
                    app.router.navigate('#create');
                }, map);

                return container;
            }
        });
        this.map.addControl(new Controls());

        app.utils.log('map:addMapControls:end');
    },

    addMapEvents: function () {
        app.utils.log('map:addMapEvents:start');

        this.map.on('popupopen', function (event) {
            var marker = event.popup.options.marker;
            if (marker) {
                marker.setOpacity(0);
            }
        }).on('popupclose', function (event) {
            var marker = event.popup.options.marker;
            if (marker) {
                marker.setOpacity(1);
            }
        });

        app.utils.log('map:addMapEvents:end');
    },

    createOrUpdateCurrentPositionMarker: function (latLng) {
        app.utils.log('map:createOrUpdateCurrentPositionMarker:start');

        if (!this.currentPositionMarker) {
            var map = this.map;
            var currentLocationTemplate = _.template($('#current-location-template').html());
            this.currentPositionMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: 'css/img/leaflet/marker-location.png',
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

    deleteMarkers: function () {
        app.utils.log('map:deleteMarkers:start');

        var map = this.map;
        _.each(this.markersArray, function (marker) {
            map.removeLayer(marker);
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
        var parsedData = JSON.parse(data);
        var markersArray = this.markersArray;
        var currentPosition = this.currentPositionMarker ? this.currentPositionMarker.getLatLng() : null;
        var infoWindowTemplate = _.template($('#info-window-template').html());

        _.each(parsedData, function (markerData) {
            var marker = L.marker([markerData.lat, markerData.lng], {
                icon: L.icon({
                    iconUrl: 'img/markers/' + markerData.prov + '.png',
                    iconSize: [37, 42],
                    iconAnchor: [19, 40]
                })
            }).on('click', function () {
                markerData.type = app.settings.types[markerData.type];
                markerData.title = app.settings.objects[markerData.prov];
                var latLng = this.getLatLng();
                if (currentPosition) {
                    markerData.distance = app.utils.roundDistance(currentPosition.distanceTo(latLng));
                }
                L.popup({
                    marker: this,
                    closeButton: false,
                    maxWidth: 260,
                    minWidth: 260
                }).setLatLng(latLng).setContent(infoWindowTemplate(markerData)).openOn(map);
            }).addTo(map);
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

        this.fetchMarkers(this.map.getCenter());

        app.utils.log('map:updateMarkers:end');
    }
});
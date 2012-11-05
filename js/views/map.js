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
        L.tileLayer(app.settings.mapTileUrlTemplate).addTo(map);

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

        $('.locate-icon', this.$el).removeClass('loading-icon');
        this.createOrUpdateCurrentPositionMarker(latLng);
        this.map.panTo(latLng);
        app.utils.saveData('mapLastLocation', latLng);

        if (window.navigator.notification) {
            window.navigator.notification.vibrate(app.settings.vibrateMilliseconds);
        }

        app.utils.log('map:onGeolocationSuccess:end');
    },

    onGeolocationError: function() {
        app.utils.log('map:onGeolocationError');

        $('.locate-icon', this.$el).removeClass('loading-icon');
        alert(tr('Could not determine the current position.'));
    },

    moveToLocation: function() {
        app.utils.log('map:moveToLocation:start');

        var self = this;
        if (navigator.geolocation) {
            $('.locate-icon', this.$el).addClass('loading-icon');
            navigator.geolocation.getCurrentPosition(function(position) {
                self.onGeolocationSuccess(position);
            }, this.onGeolocationError, app.settings.geolocationOptions);
        }

        app.utils.log('map:moveToLocation:end');
    },

    addMapControl: function(title, position, className, handler, context) {
        var Control = L.Control.extend({
            onAdd: function (map) {
                var button = L.DomUtil.create('div',
                    'nt-map-control-button ' + (L.Browser.mobile ? 'mobile ': '') + className);
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
            this.addMapControl(tr('Locate'), 'topright', 'locate-icon', self.moveToLocation, self);
            this.addMapControl(tr('Zoom Out'), 'bottomright', 'zoom-out-icon', this.map.zoomOut);
            this.addMapControl(tr('Zoom In'), 'bottomright', 'zoom-in-icon', this.map.zoomIn);
        } else {
            this.addMapControl(tr('Zoom In'), 'topleft', 'zoom-in-icon', this.map.zoomIn);
            this.addMapControl(tr('Zoom Out'), 'topleft', 'zoom-out-icon', this.map.zoomOut);
            this.addMapControl(tr('Locate'), 'topleft', 'locate-icon', self.moveToLocation, self);
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

        alert(tr('Could not load data from the server. Please try again later.'));
    },

    onFetchSuccess: function(data) {
        app.utils.log('map:onFetchSuccess:start');

        var map = this.map;
        var instance = this;
        var parsedData = JSON.parse(data);
        var showInfoWindow = this.showInfoWindow;
        var infoWindowTemplate = this.infoWindowTemplate = this.infoWindowTemplate || _.template($('#info-window-template').html());

        this.deleteMarkers();
        var markersArray = this.markersArray;

        _.each(parsedData, function (markerData) {
            var marker = L.marker([markerData.lat, markerData.lng], {
                icon: L.icon({
                    iconUrl: 'img/markers/' + markerData.prov + '.png',
                    iconSize: [37, 42],
                    iconAnchor: [19, 40]
                }),
                map: map,
                instance: instance,
                markerData: markerData,
                infoWindowTemplate: infoWindowTemplate
            }).on('click', showInfoWindow).addTo(map);
            markersArray.push(marker);
        });

        app.utils.log('map:onFetchSuccess:end');
    },

    showInfoWindow: function() {
        app.utils.log('map:showInfoWindow:start');

        var options = this.options;
        var markerLatLng = this.getLatLng();
        var markerData = options.markerData;
        var currentPosition = options.instance.currentPositionMarker;

        if (currentPosition) {
            markerData.distance = app.utils.roundDistance(currentPosition.getLatLng().distanceTo(markerLatLng));
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

        app.repository.fetchMarkers({
            objects: selectedObjects,
            filters: selectedFilters,
            center: args,
            success: this.onFetchSuccess,
            error: this.onFetchError,
            context: this
        });

        app.utils.log('map:fetchMarkers:end');
    },

    updateMarkers: function() {
        app.utils.log('map:updateMarkers:start');

        var self = this;
        setTimeout(function() {
            self.fetchMarkers(self.map.getCenter());
        }, 0);

        app.utils.log('map:updateMarkers:end');
    }
});

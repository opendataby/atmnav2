(function($, _, window) {
    window.window.app.MapView = window.window.app.PageView.extend({
        className: 'nt-map-page',

        markersArray: [],

        map: null,
        infoWindow: null,
        currentPositionMarker: null,

        initialize: function() {
            window.app.utils.log('map:initialize:start');

            var latLng = window.app.utils.loadData('mapLastLocation') || window.app.settings.defaultLatLng;
            var map = this.map = L.map(this.el, _.extend(window.app.settings.mapOptions, {center: latLng}));
            L.tileLayer(window.app.settings.mapTileUrlTemplate).addTo(map);

            this.addMapControls();
            this.addMapEvents();
            this.moveToLocation();

            window.app.utils.log('map:initialize:end');
        },

        attach: function(container) {
            window.app.utils.log('map:attach:start');

            window.app.PageView.prototype.attach.call(this, container);
            this.map.invalidateSize();

            window.app.utils.log('map:attach:end');
            return this;
        },

        detach: function() {
            window.app.PageView.prototype.detach.call(this);
            this.map.closePopup();
            return this;
        },

        onGeolocationSuccess: function(latLng) {
            window.app.utils.log('map:onGeolocationSuccess:start');

            $('.locate-icon', this.$el).removeClass('loading-icon');
            this.createOrUpdateCurrentPositionMarker(latLng);
            this.map.panTo(latLng);
            this.updateMarkers();
            window.app.utils.saveData('mapLastLocation', latLng);

            if (window.navigator.notification) {
                window.navigator.notification.vibrate(window.app.settings.vibrateMilliseconds);
            }

            window.app.utils.log('map:onGeolocationSuccess:end');
        },

        onGeolocationError: function() {
            window.app.utils.log('map:onGeolocationError');

            window.app.router.mapView.updateMarkers();
            $('.locate-icon', this.$el).removeClass('loading-icon');
            alert(tr('Could not determine the current position.'));
            window.app.utils.trackEvent('geolocation', 'error', window.app.utils.getDeviceInfo());
        },

        moveToLocation: function() {
            window.app.utils.log('map:moveToLocation:start');

            this.map.closePopup();

            var self = this;
            if (navigator.geolocation) {
                $('.locate-icon', this.$el).addClass('loading-icon');
                navigator.geolocation.getCurrentPosition(function(position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    self.onGeolocationSuccess([lat, lng]);
                }, this.onGeolocationError, window.app.settings.geolocationOptions);
            }

            window.app.utils.log('map:moveToLocation:end');
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
            window.app.utils.log('map:addMapControls:start');

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

            window.app.utils.log('map:addMapControls:end');
        },

        addMapEvents: function() {
            window.app.utils.log('map:addMapEvents:start');

            var map = this.map;
            map.on('popupclose', function(event) {
                var marker = event.popup.options.marker;
                if (marker) {
                    marker.setOpacity(1);
                    map.invalidateSize();
                }
            });

            window.app.utils.log('map:addMapEvents:end');
        },

        createOrUpdateCurrentPositionMarker: function(latLng) {
            window.app.utils.log('map:createOrUpdateCurrentPositionMarker:start');

            var self = this;
            if (!this.currentPositionMarker) {
                var map = this.map;
                var currentLocationTemplate = _.template($('#current-location-template').html());
                this.currentPositionMarker = L.marker(latLng, {
                    icon: L.icon({
                        iconUrl: 'img/marker-location.png',
                        iconSize: [31, 42],
                        iconAnchor: [16, 40]
                    }),
                    draggable: true
                }).on('click', function () {
                    L.popup({
                        marker: this,
                        closeButton: false,
                        maxWidth: 260,
                        minWidth: 260
                    }).setLatLng(this.getLatLng()).setContent(currentLocationTemplate()).openOn(map);
                }).on('dragend', function () {
                    self.onGeolocationSuccess(this.getLatLng());
                }).addTo(map);
            }
            this.currentPositionMarker.setLatLng(latLng);

            window.app.utils.log('map:createOrUpdateCurrentPositionMarker:end');
        },

        deleteMarkers: function() {
            window.app.utils.log('map:deleteMarkers:start');

            var map = this.map;
            _.each(this.markersArray, function(marker) {
                map.removeLayer(marker);
            });

            this.markersArray = [];

            window.app.utils.log('map:deleteMarkers:end');
        },

        onFetchError: function(jqXHR, textStatus, errorThrown) {
            window.app.utils.log('map:onFetchError');

            alert(tr('Could not load data from the server. Please try again later.'));

            window.app.utils.trackEvent('ajax', 'error', textStatus, window.app.utils.getDeviceInfo());
        },

        onFetchSuccess: function(data) {
            window.app.utils.log('map:onFetchSuccess:start');

            var map = this.map;
            var instance = this;
            var showInfoWindow = this.showInfoWindow;
            var infoWindowTemplate = this.infoWindowTemplate = this.infoWindowTemplate || _.template($('#info-window-template').html());

            this.deleteMarkers();
            var markersArray = this.markersArray;

            _.each(data, function (markerData) {
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

            window.app.utils.log('map:onFetchSuccess:end');
        },

        showInfoWindow: function() {
            window.app.utils.log('map:showInfoWindow:start');

            var options = this.options;
            var markerLatLng = this.getLatLng();
            var markerData = options.markerData;
            var currentPosition = options.instance.currentPositionMarker;

            if (currentPosition) {
                markerData.distance = window.app.utils.roundDistance(currentPosition.getLatLng().distanceTo(markerLatLng));
            }

            this.setOpacity(0);
            L.popup({
                marker: this,
                closeButton: false,
                maxWidth: 260,
                minWidth: 260
            }).setLatLng(markerLatLng).setContent(options.infoWindowTemplate(markerData)).openOn(options.map);

            window.app.utils.log('map:showInfoWindow:end');
        },

        fetchMarkers: function(args) {
            window.app.utils.log('map:fetchMarkers:start');

            var selectedObjects = window.app.utils.loadArrayData('objects');
            var selectedFilters = window.app.utils.loadArrayData('filters');

            if (!selectedObjects.length || !selectedFilters.length ||
                !_.without(selectedObjects, 'spec:related').length) {

                this.deleteMarkers();
                var message = window.app.utils.getMessageNoSelection(selectedObjects, selectedFilters);
                window.app.utils.alert(message, tr('Alert'));
                return;
            }

            window.app.remote.fetchMarkers({
                objects: selectedObjects,
                filters: selectedFilters,
                center: args,
                success: this.onFetchSuccess,
                error: this.onFetchError,
                context: this
            });

            window.app.utils.log('map:fetchMarkers:end');
        },

        updateMarkers: function() {
            window.app.utils.log('map:updateMarkers:start');

            var self = this;
            setTimeout(function() {
                self.fetchMarkers(self.map.getCenter());
            }, 10);

            window.app.utils.log('map:updateMarkers:end');
        }
    });
})(jQuery, _, window);
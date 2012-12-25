(function(_, app, global) {
    app.utils = {
        loadArrayData: function(keyName) {
            try {
                return JSON.parse(localStorage.getItem(keyName)) || [];
            } catch (e) {
                app.utils.trackEvent('localStorage', 'loadArrayData', 'error', keyName);
                return [];
            }
        },

        loadData: function(keyName) {
            try {
                return JSON.parse(localStorage.getItem(keyName));
            } catch (e) {
                app.utils.trackEvent('localStorage', 'loadData', 'error', keyName);
                return false;
            }
        },

        saveData: function(keyName, data) {
            setTimeout(function() {
                localStorage.setItem(keyName, JSON.stringify(data));
            }, 0);
        },

        log: function(args) {
            if (!app.settings.debug) {
                return;
            }

            var date = new Date();
            console.log([date.toLocaleTimeString(), '.', date.getMilliseconds(), ' ',  args].join(''));
        },

        roundDistance: function(distance) {
            if (distance >= 10000) {
                return Math.round(distance / 1000) + ' ' + tr('km');
            } else {
                return Math.round(distance) + ' ' + tr('m');
            }
        },

        isTouchMovePreventDefault: false,

        Scroll: function(element) {
            var self = this;
            self.iScroll = null;

            setTimeout(function() {
                var computedStyle = window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle;

                if (('ontouchstart' in window) &&
                    !computedStyle['overflow-scrolling'] &&
                    !computedStyle['-webkit-overflow-scrolling'] &&
                    !computedStyle['-moz-overflow-scrolling'] &&
                    !computedStyle['-o-overflow-scrolling']) {
                    if (!app.utils.isTouchMovePreventDefault) {
                        app.utils.isTouchMovePreventDefault = true;
                        document.addEventListener('touchmove', function(e) {
                            e.preventDefault();
                        }, false);
                    }
                    self.iScroll = new iScroll(element, {bounce: false});
                }
            }, 200);
        },

        loadExternalScripts: function(scripts) {
            var scriptElement;
            var head = document.getElementsByTagName('head').item(0);

            _.each(scripts, function(scriptName) {
                scriptElement = document.createElement("script");
                scriptElement.type = "text/javascript";
                scriptElement.src = scriptName;
                scriptElement.async = true;
                head.appendChild(scriptElement);
            });
        },

        openExternalUrl: function(url) {
            window.plugins.childBrowser.openExternal(url);
            return false;
        },

        getRelatedObjects: function(relatedForObjects) {
            app.utils.log('utils:getRelatedObjects:start');
            app.utils.log('utils:getRelatedObjects:relatedForObjects=' + relatedForObjects);

            if (relatedForObjects.indexOf('spec:related') === -1) {
                return [];
            }

            var related = [];
            _.each(relatedForObjects, function(object) {
                related = related.concat(app.settings.related[object] || []);
            });

            related = _.uniq(_.difference(related, relatedForObjects));

            app.utils.log('utils:getRelatedObjects:end');

            return related;
        },

        getMessageNoSelection: function(selectedObjects, selectedFilters) {
            selectedObjects = _.without(selectedObjects, 'spec:related');

            if (!selectedObjects.length && !selectedFilters.length) {
                return window.tr('No banks and filters selected!');
            } else if (!selectedObjects.length) {
                return window.tr('No banks selected!');
            } else if (!selectedFilters.length) {
                return window.tr('No filters selected!');
            }
        },

        alert: function(message, title) {
            if (navigator.notification) {
                navigator.notification.alert(message, null, title);
            } else {
                alert(message);
            }
        },

        setDefaults: function() {
            app.utils.log('utils:setDefaults:start');

            if (localStorage.getItem('theFirstStart') === undefined ||
                localStorage.getItem('theFirstStart') === null ||
                app.utils.loadData('theFirstStart')) {

                app.utils.saveData('theFirstStart', false);

                var currentObjects = app.utils.loadArrayData('objects');
                if (currentObjects.length) {
                    var deprecatedObjects = _.difference(currentObjects, app.settings.objects);
                    app.utils.saveData('objects', _.difference(currentObjects, deprecatedObjects));
                } else {
                    app.utils.saveData('objects', app.settings.defaultObjects);
                }

                var currentFilters = app.utils.loadArrayData('filters');
                if (currentFilters.length) {
                    var deprecatedFilters = _.difference(currentFilters, app.settings.filters);
                    app.utils.saveData('filters', _.difference(currentFilters, deprecatedFilters));
                } else {
                    app.utils.saveData('filters', app.settings.defaultFilters);
                }
            }

            app.utils.log('utils:setDefaults:end');
        },

        trackEvent: function(category, action, opt_label, opt_value, opt_noninteraction) {
            if (app.settings.debug) {
                return;
            }

            var trackData = ['_trackEvent'];

            _.each(arguments, function(arg) {
                trackData.push(arg);
            });
            global._gaq.push(trackData);
        },

        trackPage: function(page) {
            if (app.settings.debug) {
                return;
            }

            global._gaq.push(['_trackPageview', page]);
        },

        getDeviceInfo: function() {
            if (!window.device) {
                return 'unknown';
            }

            var connectionType = 'Unknown connection';
            if (window.navigator.connection && window.Connection) {
                var states = {};
                states[window.Connection.UNKNOWN] = 'Unknown connection';
                states[window.Connection.ETHERNET] = 'Ethernet connection';
                states[window.Connection.WIFI] = 'WiFi connection';
                states[window.Connection.CELL_2G] = 'Cell 2G connection';
                states[window.Connection.CELL_3G] = 'Cell 3G connection';
                states[window.Connection.CELL_4G] = 'Cell 4G connection';
                states[window.Connection.NONE] = 'No network connection';
                connectionType = states[window.navigator.connection.type];
            }

            return [device.platform, device.name, device.version, connectionType].join(' | ');
        }
    };
})(_, window.app, window);
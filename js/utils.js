(function(_, app, global, undefined) {
    var _cache = {};

    app.utils = {
        loadData: function(keyName, defaultValue) {
            if (keyName in _cache) {
                return _.clone(_cache[keyName]);
            }

            var data = defaultValue;
            try {
                var storageData = localStorage.getItem(keyName);
                if (storageData) {
                    data = JSON.parse(storageData);
                }
            } catch (e) {
                app.utils.trackEvent('localStorage', 'loadData', 'error', keyName);
            } finally {
                _cache[keyName] = data;
                return data;
            }
        },

        saveData: function(keyName, data) {
            _cache[keyName] = data;

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

        // Android 4.1+ doesn't have overflow-scrolling css property
        // for native scrolling detecting but support it as is.
        // So there detected android 4 and 5 by userAgent.
        // We detect android 5 because new devices on android 5 can also miss overflow-scrolling property.
        isAndroid4: window.navigator.userAgent.toLowerCase().search('android 4') !== -1,
        isAndroid5: window.navigator.userAgent.toLowerCase().search('android 5') !== -1,

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
                    !computedStyle['-o-overflow-scrolling'] &&
                    !(app.utils.isAndroid4 || app.utils.isAndroid5)) {
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
            if (window.plugins && window.plugins.childBrowser) {
                window.plugins.childBrowser.openExternal(url);
                return false;
            }

            return true;
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

            if (app.utils.loadData('theFirstStart', true)) {
                app.utils.saveData('theFirstStart', false);

                var currentObjects = app.utils.loadData('objects', []);
                if (currentObjects.length) {
                    var deprecatedObjects = _.difference(currentObjects, app.settings.objects);
                    app.utils.saveData('objects', _.difference(currentObjects, deprecatedObjects));
                } else {
                    app.utils.saveData('objects', app.settings.defaultObjects);
                }

                var currentFilters = app.utils.loadData('filters', []);
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
var app = app || {};

app.utils = {
    loadArrayData: function(keyName) {
        try {
            return JSON.parse(localStorage.getItem(keyName)) || [];
        } catch (e) {
            return [];
        }
    },

    loadData: function(keyName) {
        return JSON.parse(localStorage.getItem(keyName));
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

        if (relatedForObjects.indexOf('spec:related') == -1) {
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
            return tr('No banks and filters selected!');
        } 
        else if (!selectedObjects.length) {
            return tr('No banks selected!');
        } else if (!selectedFilters.length) {
            return tr('No filters selected!');
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
            app.utils.loadData('theFirstStart')) {

            app.utils.saveData('theFirstStart', false);
            app.utils.saveData('objects', app.settings.defaultObjects);
            app.utils.saveData('filters', app.settings.defaultFilters);
        }

        app.utils.log('utils:setDefaults:end');
    }
};
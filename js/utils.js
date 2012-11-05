var app = app || {};

app.utils = {
    loadArrayData: function (keyName) {
        try {
            return JSON.parse(localStorage.getItem(keyName)) || [];
        } catch (e) {
            return [];
        }
    },

    loadData: function (keyName) {
        return JSON.parse(localStorage.getItem(keyName));
    },

    saveData: function (keyName, data) {
        setTimeout(function() {
            localStorage.setItem(keyName, JSON.stringify(data));
        }, 0);
    },

    log: function (args) {
        if (!app.settings.debug) {
            return;
        }

        var date = new Date();
        console.log([date.toLocaleTimeString(), '.', date.getMilliseconds(), ' ',  args].join(''));
    },

    roundDistance: function (distance) {
        if (distance >= 10000) {
            return Math.round(distance / 1000) + ' ' + tr('km');
        } else {
            return Math.round(distance) + ' ' + tr('m');
        }
    },

    isTouchMovePreventDefault: false,

    Scroll: function (element) {
        var self = this;
        self.iScroll = null;

        setTimeout(function () {
            var computedStyle;
            if (window.getComputedStyle) {
                computedStyle = getComputedStyle(element, null);
            } else {
                computedStyle = element.currentStyle;
            }

            if ((computedStyle.overflow !== 'auto') &&
                (computedStyle.overflow !== 'scroll') &&
                (computedStyle.overflowY !== 'auto') &&
                (computedStyle.overflowY !== 'scroll')) {
                if (!app.utils.isTouchMovePreventDefault) {
                    app.utils.isTouchMovePreventDefault = true;
                    document.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);
                }
                self.iScroll = new iScroll(element);
            }
        }, 200);
    }
};
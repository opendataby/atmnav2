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
            return Math.round(distance / 1000) + ' км';
        } else {
            return Math.round(distance) + ' м';
        }
    }
};
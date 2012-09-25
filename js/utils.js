var app = app || {};

(function ($) {
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
            localStorage.setItem(keyName, JSON.stringify(data));
        },
    }
})(jQuery);
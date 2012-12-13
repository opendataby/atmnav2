(function($, window) {
    window.app.tr = {
        'default': window.app.settings.language['default'],
        language: window.app.settings.language['default'],

        translate: function(data) {
            if (!data) {
                return '';
            }

            if (typeof data === 'object') {
                return data && data.hasOwnProperty(this.language) ? data[this.language] : data[this['default']];
            } else {
                var dictionary = window.app.tr[this.language];
                return dictionary && dictionary.hasOwnProperty(data) ? dictionary[data] : data;
            }
        },

        translatePageFromData: function() {
            $('*[data-tr]').each(function () {
                $(this).text(tr($(this).data('tr')));
            });
        }
    };

    window.tr = function(data) {
        return window.app.tr.translate(data);
    };
})(jQuery, window);
(function($, app) {
    app.remote = {
        fetchMarkers: function(options) {
            var params = {
                'objects[]': options.objects.concat(app.utils.getRelatedObjects(options.objects)),
                'filters[]': options.filters
            };

            if (options.center && options.center.lat && options.center.lng) {
                params.lat = options.center.lat;
                params.lng = options.center.lng;
            }

            app.xhr = $.ajax({
                url: app.settings.serverUrl,
                data: params,
                dataType: 'json',
                success: options.success,
                error: options.error,
                context: options.context,
                timeout: app.settings.ajaxTimeout
            });

            app.utils.trackEvent('ajax', 'get', JSON.stringify(params));
        },

        submitPoint: function(form) {
            // DO NOTHING
            return true;
        }
    };
})(jQuery, window.app);
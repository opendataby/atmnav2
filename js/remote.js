(function($, window) {
    window.app.remote = {
        fetchMarkers: function(options) {
            var params = {
                'objects[]': options.objects.concat(window.app.utils.getRelatedObjects(options.objects)),
                'filters[]': options.filters
            };

            if (options.center && options.center.lat && options.center.lng) {
                params.lat = options.center.lat;
                params.lng = options.center.lng;
            }

            window.app.xhr = $.ajax({
                url: window.app.settings.serverUrl,
                data: params,
                dataType: 'json',
                success: options.success,
                error: options.error,
                context: options.context
            });

            window.app.utils.trackEvent('ajax', 'get', JSON.stringify(params));
        }
    };
})(jQuery, window);
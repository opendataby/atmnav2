app.repository = {
    fetchMarkers: function (options) {
        var params = {
            'objects[]': options.objects,
            'filters[]': options.filters
        };

        if (options.center && options.center.lat && options.center.lng) {
            params.lat = options.center.lat;
            params.lng = options.center.lng;
        }

        $.ajax({
            url: app.settings.serverUrl,
            data: params,
            dataType: 'json',
            success: options.success,
            error: options.error,
            context: options.context
        });
    }
};
var app = app || {};

app.remote = {
    getRelatedObjects: function(objects) {
        var related = [];
        if (objects.indexOf('spec:related') !== -1) {
            _.each(objects, function(object) {
                related = related.concat(app.settings.related[object] || []);
            });
            related = _.uniq(related);
            _.each(objects, function(object) {
                related = _.without(related, object);
            });
        }
        return related;
    },

    selectRelatedObjects: function(objects, items) {
        var related = app.remote.getRelatedObjects(objects);
        relatedSelection = $();
        items.each(function() {
            if (related.indexOf($(this).data('id')) !== -1) {
                relatedSelection = relatedSelection.add($(this));
            }
        });

        relatedSelection.addClass('related');
        items.not(relatedSelection).removeClass('related');
    },

    fetchMarkers: function(options) {
        var params = {
            'objects[]': options.objects.concat(this.getRelatedObjects(options.objects)),
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
            context: options.context
        });
    }
};

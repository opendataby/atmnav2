var app = app || {};

(function ($) {
    app.ObjectsView = Backbone.View.extend({
        tagName: 'ul',
        className: 'nt-objects-page',

        initialize: function (args) {
            app.utils.log('objects:initialize:start');

            var objects = [];
            var selectedObjects = app.utils.loadArrayData('objects');
            var objectTemplate = _.template($('#object-template').html());

            _.each(app.settings.objects, function (title, id) {
                objects.push(new app.ObjectView(objectTemplate, {
                    'id': id,
                    'title': title,
                    'checked': _.include(selectedObjects, id)
                }).el);
            });

            this.$el.append(objects);

            app.utils.log('objects:initialize:end');
        }
    });
})(jQuery);
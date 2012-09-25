var app = app || {};

(function ($) {
    app.ObjectsView = Backbone.View.extend({
        tagName: 'ul',
        id: 'objects-block',

        initialize: function (args) {
            var objects = [];
            var selectedObjects = app.utils.loadArrayData('objects');

            _.each(app.settings.objects, function (title, id) {
                objects.push(new app.ObjectView({
                    'id': id,
                    'title': title,
                    'checked': _.include(selectedObjects, id)
                }).el);
            });

            this.$el.append(objects);
        }
    });
})(jQuery);
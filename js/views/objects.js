var app = app || {};

app.ObjectsView = Backbone.View.extend({
    tagName: 'ul',
    className: 'nt-list-page',

    initialize: function (args) {
        app.utils.log('objects:initialize:start');

        var objects = [];
        var selectedObjects = app.utils.loadArrayData('objects');
        var objectTemplate = _.template($('#object-template').html());

        _.each(app.settings.objects, function (title, id) {
            objects.push(new app.ObjectView({
                template: objectTemplate,
                id: id,
                title: title,
                icon: id.indexOf('spec:') !== 0,
                checked: _.include(selectedObjects, id)
            }).el);
        });

        this.$el.append(objects);

        app.utils.log('objects:initialize:end');
    }
});
app.ObjectsView = app.PageView.extend({
    tagName: 'ul',
    className: 'nt-list-page',

    initialize: function (args) {
        app.utils.log('objects:initialize:start');

        var objects = [];
        var selectedObjects = app.utils.loadArrayData('objects');
        var objectTemplate = _.template($('#object-template').html());

        _.each(app.settings.objects, function (id) {
            objects.push(new app.ObjectView({
                template: objectTemplate,
                id: id,
                icon: id.indexOf('spec:') !== 0,
                checked: _.include(selectedObjects, id)
            }).el);
        });

        this.$el.append(objects);

        app.utils.log('objects:initialize:end');
    }
});
app.ObjectsView = app.PageView.extend({
    tagName: 'div',
    className: 'nt-list-page',
    _fastClick: null,
    _iScroll: null,
    specialClasses: {
        'spec:all': 'nt-list-item-spec-all',
        'spec:related': 'nt-list-item-spec-related'
    },

    initialize: function(args) {
        app.utils.log('objects:initialize:start');

        var scroller = $('<ul class="nt-list-scroller"></ul>');
        var selectedObjects = app.utils.loadArrayData('objects');
        var objectTemplate = _.template($('#object-template').html());
        var disabled = _.include(selectedObjects, 'spec:all');
        var specilaClasses = this.specialClasses;
        _.each(app.settings.objects, function (id) {
            scroller.append(new app.ObjectView({
                id: id,
                template: objectTemplate,
                icon: id.indexOf('spec:') !== 0,
                checked: _.include(selectedObjects, id),
                disabled: disabled && (id !== 'spec:all'),
                className: specilaClasses[id]
            }).el);
        });

        app.remote.selectRelatedObjects(selectedObjects, scroller.children());

        this.$el.append(scroller);
        this._scroll = new app.utils.Scroll(this.el);

        app.utils.log('objects:initialize:end');
    }
});

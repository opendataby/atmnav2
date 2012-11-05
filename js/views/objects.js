app.ObjectsView = app.PageView.extend({
    tagName: 'div',
    className: 'nt-list-page',
    _fastClick: null,
    _iScroll: null,

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

        var scroller = $('<ul class="nt-list-scroller"></ul>');
        scroller.append(objects);
        this.$el.append(scroller);

        this._fastClick = new FastClick(this.el);
        this._scroll = new app.utils.Scroll(this.el);

        app.utils.log('objects:initialize:end');
    }
});
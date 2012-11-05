app.FiltersView = app.PageView.extend({
    tagName: 'div',
    className: 'nt-list-page',
    _fastClick: null,
    _iScroll: null,

    initialize: function(args) {
        app.utils.log('filters:initialize:start');

        var scroller = $('<ul class="nt-list-scroller"></ul>');
        var selectedFilters = app.utils.loadArrayData('filters');
        var filterTemplate = _.template($('#filter-template').html());

        _.each(app.settings.filters, function (id) {
            scroller.append(new app.FilterView({
                id: id,
                template: filterTemplate,
                checked: _.include(selectedFilters, id)
            }).el);
        });

        this.$el.append(scroller);

        this._fastClick = new FastClick(this.el);
        this._scroll = new app.utils.Scroll(this.el);

        app.utils.log('filters:initialize:end');
    }
});

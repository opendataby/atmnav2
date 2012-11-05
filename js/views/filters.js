app.FiltersView = app.PageView.extend({
    tagName: 'div',
    className: 'nt-list-page',
    _fastClick: null,
    _iScroll: null,

    initialize: function (args) {
        app.utils.log('filters:initialize:start');

        var filters = [];
        var selectedFilters = app.utils.loadArrayData('filters');
        var filterTemplate = _.template($('#filter-template').html());

        _.each(app.settings.filters, function (id) {
            filters.push(new app.FilterView({
                template: filterTemplate,
                id: id,
                checked: _.include(selectedFilters, id)
            }).el);
        });

        var scroller = $('<ul class="nt-list-scroller"></ul>');
        scroller.append(filters);
        this.$el.append(scroller);

        this._fastClick = new FastClick(this.el);
        this._scroll = new app.utils.Scroll(this.el);

        app.utils.log('filters:initialize:end');
    }
});
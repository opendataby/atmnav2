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
    },

    attach: function(container) {
        app.utils.log('filters:attach:start');

        app.PageView.prototype.attach.call(this, container);
        this.initialFilters = app.utils.loadArrayData('filters');

        app.utils.log('filters:attach:end');
        return this;
    },

    detach: function() {
        app.utils.log('flters:detach:start');

        app.PageView.prototype.detach.call(this);
        var selectedFilters = $('li.nt-list-item.checked', this.$el).map(function() {
            return $(this).attr('data-id');
        }).get();

        if (_.difference(this.initialFilters, selectedFilters).length ||
            _.difference(selectedFilters, this.initialFilters).length) {
            app.router.mapView.updateMarkers();
        }

        app.utils.log('flters:detach:end');
        return this;
    }
});

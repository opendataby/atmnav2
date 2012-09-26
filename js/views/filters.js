var app = app || {};

(function ($) {
    app.FiltersView = Backbone.View.extend({
        tagName: 'ul',
        id: 'filters-block',

        initialize: function (args) {
            app.utils.log('filters:initialize');

            var filters = [];
            var selectedFilters = app.utils.loadArrayData('filters');
            var filterTemplate = _.template($('#filter-template').html());

            _.each(app.settings.filters, function (title, id) {
                filters.push(new app.FilterView(filterTemplate, {
                    'id': id,
                    'title': title,
                    'checked': _.include(selectedFilters, id)
                }).el);
            });

            this.$el.append(filters);
        }
    });
})(jQuery);
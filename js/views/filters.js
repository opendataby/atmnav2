var app = app || {};

(function ($) {
    app.FiltersView = Backbone.View.extend({
        tagName: 'ul',
        id: 'filters-block',

        initialize: function (args) {
            var filters = [];
            var selectedFilters = app.utils.loadArrayData('filters');

            _.each(app.settings.filters, function (title, id) {
                filters.push(new app.FilterView({
                    'id': id,
                    'title': title,
                    'checked': _.include(selectedFilters, id)
                }).el);
            });

            this.$el.append(filters);
        }
    });
})(jQuery);
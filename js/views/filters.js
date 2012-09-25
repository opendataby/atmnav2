var app = app || {};

(function ($) {
    app.FiltersView = Backbone.View.extend({
        tagName: 'ul',
        id: 'filters-block',

        filters: {
            'type:bank': 'Банк',
            'type:terminal': 'Инфокиоск',
            'type:exchange': 'Обмен валюты',
            'type:atm:currency:byr': 'Банкомат (BYR)',
            'type:atm:currency:rur': 'Банкомат (RUR)',
            'type:atm:currency:usd': 'Банкомат (USD)',
            'type:atm:currency:eur': 'Банкомат (EUR)'
        },

        initialize: function (args) {
            var filters = [];
            var selectedFilters = app.utils.loadArrayData('filters');

            _.each(this.filters, function (title, id) {
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
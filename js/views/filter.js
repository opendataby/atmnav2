var app = app || {};

(function ($) {
    app.FilterView = Backbone.View.extend({
        tagName: 'li',
        events: {
            'change input': 'onChange'
        },

        initialize: function (args) {
            app.utils.log('filter:initialize');

            this.render(args);
        },

        render: function (args) {
            app.utils.log('filter:render');

            var template = _.template($('#filter-template').html());
            this.$el.html(template(args));
        },

        onChange: function (event) {
            app.utils.log('filter:onChange');

            var storageKey = 'filters';
            var checked = event.target.checked;
            var selectedFilters = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedFilters.push(this.id);
            } else {
                selectedFilters = _.without(selectedFilters, this.id);
            }

            app.utils.saveData(storageKey, _.uniq(selectedFilters));
        }
    });
})(jQuery);
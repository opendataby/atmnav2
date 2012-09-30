var app = app || {};

(function ($) {
    app.FilterView = Backbone.View.extend({
        events: {
            'click': 'onChange'
        },

        make: function () {
            app.utils.log('filter:make');

            return this.options.template(this.options);
        },

        onChange: function (event) {
            app.utils.log('filter:onChange:start');

            var storageKey = 'filters';
            var element = event.target;
            var checked = $(element).closest('.nt-list-item').toggleClass('checked').hasClass('checked');
            var selectedFilters = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedFilters.push(this.options.id);
            } else {
                selectedFilters = _.without(selectedFilters, this.options.id);
            }

            app.utils.saveData(storageKey, _.uniq(selectedFilters));

            app.utils.log('filter:onChange:end');
        }
    });
})(jQuery);
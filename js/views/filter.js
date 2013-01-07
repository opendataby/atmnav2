(function($, _, Backbone, app) {
    app.FilterView = Backbone.View.extend({
        events: {
            'click': 'onChange'
        },

        make: function() {
            app.utils.log('filter:make');

            return this.options.template(this.options);
        },

        onChange: function(event) {
            app.utils.log('filter:onChange:start');

            var filterId = this.options.id;
            var element = $(event.target).closest('.nt-list-item');
            var checked = element.toggleClass('checked').hasClass('checked');

            var storageKey = 'filters';
            var selectedFilters = app.utils.loadData(storageKey, []);

            if (checked) {
                selectedFilters.push(filterId);
            } else {
                selectedFilters = _.without(selectedFilters, filterId);
            }

            app.utils.saveData(storageKey, _.compact(_.uniq(selectedFilters)));

            app.utils.log('filter:onChange:end');
        }
    });
})(jQuery, _, Backbone, window.app);
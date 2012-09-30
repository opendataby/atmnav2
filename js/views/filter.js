var app = app || {};

(function ($) {
    app.FilterView = Backbone.View.extend({
        tagName: 'li',
        className: 'nt-list-item',

        events: {
            'click': 'onChange'
        },

        initialize: function (template, args) {
            app.utils.log('filter:initialize:start');

            this.id = args.id;
            var element = this.$el;
            if (args.checked) {
                element.addClass('checked');
            }
            element.html(template(args));

            app.utils.log('filter:initialize:end');
        },

        onChange: function (event) {
            app.utils.log('filter:onChange:start');

            var storageKey = 'filters';
            var element = event.target;
            var checked = $(element).closest('.nt-list-item').toggleClass('checked').hasClass('checked');
            var selectedFilters = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedFilters.push(this.id);
            } else {
                selectedFilters = _.without(selectedFilters, this.id);
            }

            app.utils.saveData(storageKey, _.uniq(selectedFilters));

            app.utils.log('filter:onChange:end');
        }
    });
})(jQuery);
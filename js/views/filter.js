var app = app || {};

(function ($) {
    app.FilterView = Backbone.View.extend({
        tagName: 'li',
        className: 'nt-list-item',

        events: {
            'change input': 'onChange'
        },

        initialize: function (template, args) {
            app.utils.log('filter:initialize:start');

            this.$el.html(template(args));

            app.utils.log('filter:initialize:end');
        },

        onChange: function (event) {
            app.utils.log('filter:onChange:start');

            var storageKey = 'filters';
            var element = event.target;
            var checked = element.checked;
            var selectedFilters = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedFilters.push(this.id);
                element.setAttribute('checked', 'checked');
            } else {
                selectedFilters = _.without(selectedFilters, this.id);
                element.removeAttribute('checked');
            }

            app.utils.saveData(storageKey, _.uniq(selectedFilters));

            app.utils.log('filter:onChange:end');
        }
    });
})(jQuery);
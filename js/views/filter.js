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

        var element = $(event.target).closest('.nt-list-item');
        var checked = element.toggleClass('checked').hasClass('checked');

        var storageKey = 'filters';
        var selectedFilters = app.utils.loadArrayData(storageKey);

        if (checked) {
            selectedFilters.push(this.options.id);
        } else {
            selectedFilters = _.without(selectedFilters, this.options.id);
        }

        app.utils.saveData(storageKey, _.compact(_.uniq(selectedFilters)));

        app.utils.log('filter:onChange:end');
    }
});
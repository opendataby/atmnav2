var app = app || {};

(function ($) {
    app.ObjectView = Backbone.View.extend({
        events: {
            'click': 'onChange'
        },

        make: function () {
            app.utils.log('object:make');

            return this.options.template(this.options);
        },

        onChange: function (event) {
            app.utils.log('object:onChange:start');

            var storageKey = 'objects';
            var element = event.target;
            var checked = $(element).closest('.nt-list-item').toggleClass('checked').hasClass('checked');

            var selectedObjects = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedObjects.push(this.options.id);
            } else {
                selectedObjects = _.without(selectedObjects, this.options.id);
            }

            app.utils.saveData(storageKey, _.compact(_.uniq(selectedObjects)));

            app.utils.log('object:onChange:end');
        }
    });
})(jQuery);
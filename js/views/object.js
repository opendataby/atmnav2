var app = app || {};

(function ($) {
    app.ObjectView = Backbone.View.extend({
        tagName: 'li',
        className: 'nt-object-item',

        events: {
            'change input': 'onChange'
        },

        initialize: function (template, args) {
            app.utils.log('object:initialize:start');

            this.$el.html(template(args));

            app.utils.log('object:initialize:end');
        },

        onChange: function (event) {
            app.utils.log('object:onChange:start');

            var storageKey = 'objects';
            var checked = event.target.checked;
            var selectedObjects = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedObjects.push(this.id);
            } else {
                selectedObjects = _.without(selectedObjects, this.id);
            }

            app.utils.saveData(storageKey, _.uniq(selectedObjects));

            app.utils.log('object:onChange:end');
        }
    });
})(jQuery);
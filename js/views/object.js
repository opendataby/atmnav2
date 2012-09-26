var app = app || {};

(function ($) {
    app.ObjectView = Backbone.View.extend({
        tagName: 'li',
        events: {
            'change input': 'onChange'
        },

        initialize: function (args) {
            app.utils.log('object:initialize');

            this.render(args);
        },

        render: function (args) {
            app.utils.log('object:render');

            var template = _.template($('#object-template').html());
            this.$el.html(template(args));
        },

        onChange: function (event) {
            app.utils.log('object:onChange');

            var storageKey = 'objects';
            var checked = event.target.checked;
            var selectedObjects = app.utils.loadArrayData(storageKey);

            if (checked) {
                selectedObjects.push(this.id);
            } else {
                selectedObjects = _.without(selectedObjects, this.id);
            }

            app.utils.saveData(storageKey, _.uniq(selectedObjects));
        }
    });
})(jQuery);
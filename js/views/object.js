(function($, _, Backbone, app) {
    app.ObjectView = Backbone.View.extend({
        events: {
            'click': 'onChange'
        },

        make: function() {
            app.utils.log('object:make');

            return this.options.template(this.options);
        },

        onChange: function(event) {
            app.utils.log('object:onChange:start');

            var element = $(event.target).closest('.nt-list-item');

            if (element.hasClass('disabled')) {
                return;
            }

            var objectId = this.options.id,
                checked = element.toggleClass('checked').hasClass('checked');
            if (objectId === 'spec:all') {
                element.siblings().toggleClass('disabled', checked);
            }

            var storageKey = 'objects',
                selectedObjects = app.utils.loadData(storageKey, []);

            if (checked) {
                selectedObjects.push(objectId);
            } else {
                selectedObjects = _.without(selectedObjects, objectId);
            }

            app.router.objectsView.selectRelatedObjects.call(this, selectedObjects, element.siblings().add(element));

            app.utils.saveData(storageKey, _.compact(_.uniq(selectedObjects)));

            app.utils.log('object:onChange:end');
        }
    });
})(jQuery, _, Backbone, window.app);
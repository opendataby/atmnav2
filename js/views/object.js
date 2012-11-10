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

        var checked = element.toggleClass('checked').hasClass('checked');
        if (this.options.id === 'spec:all') {
            element.siblings().toggleClass('disabled', checked);
        }

        var storageKey = 'objects';
        var selectedObjects = app.utils.loadArrayData(storageKey);

        if (checked) {
            selectedObjects.push(this.options.id);
        } else {
            selectedObjects = _.without(selectedObjects, this.options.id);
        }

        app.router.objectsView.selectRelatedObjects.call(this, selectedObjects, element.siblings().add(element));

        app.utils.saveData(storageKey, _.compact(_.uniq(selectedObjects)));

        app.utils.log('object:onChange:end');
    }
});
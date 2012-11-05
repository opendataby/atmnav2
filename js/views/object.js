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

        var element = $(event.target);
        var object = element.closest('li.nt-list-item');

        if (object.hasClass('nt-disabled')) {
            return; // do not process events from disabled element
        }

        var storageKey = 'objects';
        var checked = element.closest('.nt-list-item').toggleClass('checked').hasClass('checked');
        var selectedObjects = app.utils.loadArrayData(storageKey);

        if (checked) {
            selectedObjects.push(this.options.id);
        } else {
            selectedObjects = _.without(selectedObjects, this.options.id);
        }

        if (this.options.id == 'spec:all') {
            var elements = $('.nt-list-item:gt(0)', object.parent());
            if (checked) {
                elements.addClass('nt-disabled').children().addClass('nt-disabled');
            } else {
                elements.removeClass('nt-disabled').children().removeClass('nt-disabled');
            }
        }

        app.utils.saveData(storageKey, _.compact(_.uniq(selectedObjects)));

        app.utils.log('object:onChange:end');
    }
});
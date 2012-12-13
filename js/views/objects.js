(function($, _, window) {
    window.app.ObjectsView = window.app.PageView.extend({
        tagName: 'div',
        className: 'nt-list-page',
        _fastClick: null,
        _iScroll: null,
        specialClasses: {
            'spec:all': 'nt-list-item-spec-all',
            'spec:related': 'nt-list-item-spec-related'
        },

        initialize: function(args) {
            window.app.utils.log('objects:initialize:start');

            var scroller = $('<ul class="nt-list-scroller"></ul>');
            var selectedObjects = window.app.utils.loadArrayData('objects');
            var objectTemplate = _.template($('#object-template').html());
            var disabled = _.include(selectedObjects, 'spec:all');
            var specilaClasses = this.specialClasses;

            _.each(window.app.settings.objects, function (id) {
                scroller.append(new window.app.ObjectView({
                    id: id,
                    template: objectTemplate,
                    icon: id.indexOf('spec:') !== 0,
                    checked: _.include(selectedObjects, id),
                    disabled: disabled && (id !== 'spec:all'),
                    className: specilaClasses[id]
                }).el);
            });

            this.selectRelatedObjects(selectedObjects, scroller.children());
            this.$el.append(scroller);
            this._scroll = new window.app.utils.Scroll(this.el);

            window.app.utils.log('objects:initialize:end');
        },

        selectRelatedObjects: function(objects, items) {
            var related = window.app.utils.getRelatedObjects(objects);

            relatedSelection = $();
            items.each(function() {
                if (related.indexOf($(this).data('id')) !== -1) {
                    relatedSelection = relatedSelection.add($(this));
                }
            });

            relatedSelection.addClass('related');
            items.not(relatedSelection).removeClass('related');
        },

        attach: function(container) {
            window.app.utils.log('objects:attach:start');

            window.app.PageView.prototype.attach.call(this, container);
            this.initialObjects = window.app.utils.loadArrayData('objects');

            window.app.utils.log('objects:attach:end');
            return this;
        },

        detach: function() {
            window.app.utils.log('objects:detach:start');

            window.app.PageView.prototype.detach.call(this);
            var selectedObjects = $('li.nt-list-item.checked', this.$el).map(function() {
                return $(this).attr('data-id');
            }).get();

            if (_.difference(this.initialObjects, selectedObjects).length ||
                _.difference(selectedObjects, this.initialObjects).length) {
                window.app.router.mapView.updateMarkers();
            }

            window.app.utils.log('objects:detach:end');
            return this;
        }
    });
})(jQuery, _, window);
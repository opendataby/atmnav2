(function($, _, app) {
    app.CreateView = app.PageView.extend({
        _scroll: null,
        events: {
            'submit': 'onSubmit'
        },

        make: function() {
            app.utils.log('create:make');

            return _.template($('#create-template').html())({
                'items': app.settings.objects.slice(2)
            });
        },

        onSubmit: function(event) {
            console.log('create:onSubmit');

            event.preventDefault();
            event.stopPropagation();
            var form = this.$el.find('.nt-create-form');
            if (app.remote.submitPoint(form)) {
                form.find('input').val('');
            }
            return false;
        }
    });
})(jQuery, _, window.app);
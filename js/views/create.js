(function($, _, app) {
    app.CreateView = app.PageView.extend({
        _scroll: null,
        events: {
            'submit': 'onSubmit'
        },

        make: function() {
            app.utils.log('create:make');

            return _.template($('#create-template').html())();
        },

        initialize: function () {
            this._scroll = new app.utils.Scroll(this.el);
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
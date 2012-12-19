(function($, _, app) {
    app.CreateView = app.PageView.extend({
        events: {
            'submit': 'onSubmit'
        },

        make: function() {
            app.utils.log('create:make');

            return _.template($('#create-template').html())();
        },

        onSubmit: function() {
            console.log(this.serialize());
            return false;
        }
    });
})(jQuery, _, window.app);
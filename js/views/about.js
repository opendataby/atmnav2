(function($, _, app) {
    app.AboutView = app.PageView.extend({
        events: {
            'click #site': 'openUrl',
            'click #licence': 'openUrl'
        },

        make: function() {
            app.utils.log('about:make');

            return _.template($('#about-template').html())();
        },

        openUrl: function(event) {
            return app.utils.openExternalUrl(event.target.href);
        }
    });
})(jQuery, _, window.app);
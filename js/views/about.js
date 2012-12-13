(function($, _, window) {
    window.app.AboutView = window.app.PageView.extend({
        events: {
            'click #site': 'openUrl',
            'click #licence': 'openUrl'
        },

        make: function() {
            window.app.utils.log('about:make');

            return _.template($('#about-template').html())();
        },

        openUrl: function(event) {
            return window.app.utils.openExternalUrl(event.target.href);
        }
    });
})(jQuery, _, window);
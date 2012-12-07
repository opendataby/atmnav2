app.AboutView = app.PageView.extend({
    events: {
        'click #site': 'openUrl',
        'click #licence': 'openUrl'
    },

    make: function() {
        app.utils.log('about:make');

        return _.template($('#about-template').html())();
    },

    attach: function(container) {
        app.utils.log('about:attach:start');

        app.PageView.prototype.attach.call(this, container);

        app.utils.trackPage('about');
        app.utils.log('about:attach:end');
        return this;
    },

    openUrl: function(event) {
        return app.utils.openExternalUrl(event.target.href);
    }
});
(function($, _, Backbone, app) {
    app.PanelView = Backbone.View.extend({
        el: '.nt-nav',
        _fastClick: null,

        events: {
            'click': 'onClick'
        },

        initialize: function() {
            this._fastClick = new FastClick(this.el);
        },

        onClick: function(event) {
            app.utils.log('panel:onClick:start');

            var link = $(event.target).closest('.nt-nav-tab-link');
            var route = link.attr('href');
            if (route) {
                app.router.navigate(route);
            }

            app.utils.log('panel:onClick:end');
            return false;
        }
    });

    app.panelView = new app.PanelView();
})(jQuery, _, Backbone, window.app);
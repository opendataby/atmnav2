(function($, _, Backbone, window) {
    window.app.PanelView = Backbone.View.extend({
        el: '.nt-nav',
        _fastClick: null,

        events: {
            'click': 'onClick'
        },

        initialize: function() {
            this._fastClick = new FastClick(this.el);
        },

        onClick: function(event) {
            window.app.utils.log('panel:onClick:start');

            var link = $(event.target).closest('.nt-nav-tab-link');
            var route = link.attr('href');
            if (route) {
                window.app.router.navigate(route);
            }

            window.app.utils.log('panel:onClick:end');
            return false;
        }
    });

    window.app.panelView = new window.app.PanelView();
})(jQuery, _, Backbone, window);
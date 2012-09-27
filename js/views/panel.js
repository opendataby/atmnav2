var app = app || {};

(function ($) {
    app.PanelView = Backbone.View.extend({
        el: '.nt-nav',
        tabs: $('.nt-nav-tab-link'),

        events: {
            'click a': 'onClick'
        },

        onClick: function (event) {
            this.tabs.removeClass('active-tab');
            $(event.target).addClass('active-tab');
        }
    });

    app.panelView = new app.PanelView();
})(jQuery);
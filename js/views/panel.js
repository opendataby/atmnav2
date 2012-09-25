var app = app || {};

(function ($) {
    app.PanelView = Backbone.View.extend({
        el: '#nav',

        tabs: $('#nav a'),

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
app.PanelView = Backbone.View.extend({
    el: '.nt-nav',
    tabs: $('.nt-nav-tab-link'),

    events: {
        'click': 'onClick'
    },

    onClick: function (event) {
        this.tabs.removeClass('active');
        $(event.target).closest('.nt-nav-tab-link').addClass('active');
    }
});

app.panelView = new app.PanelView();
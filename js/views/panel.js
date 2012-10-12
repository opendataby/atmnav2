app.PanelView = Backbone.View.extend({
    el: '.nt-nav',
    tabs: $('.nt-nav-tab-link'),

    events: {
        'click': 'onClick'
    },

    onClick: function (event) {
        var link = $(event.target).closest('.nt-nav-tab-link');
        this.tabs.removeClass('active').filter(link).addClass('active');
        app.router.navigate(link.attr('href'));
        return false;
    }
});

app.panelView = new app.PanelView();
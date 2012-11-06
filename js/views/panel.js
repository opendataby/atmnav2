app.PanelView = Backbone.View.extend({
    el: '.nt-nav',
    tabs: $('.nt-nav-tab-link'),

    events: {
        'click': 'onClick'
    },

    initialize: function() {
        new FastClick(this.el);
    },

    onClick: function(event) {
        app.utils.log('panel:onClick:start');

        var link = $(event.target).closest('.nt-nav-tab-link');
        this.tabs.removeClass('active').filter(link).addClass('active');
        app.router.navigate(link.attr('href'));

        app.utils.log('panel:onClick:end');
        return false;
    }
});

app.panelView = new app.PanelView();
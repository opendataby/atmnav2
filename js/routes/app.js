(function($, Backbone, window) {
    var AppRouter = Backbone.Router.extend({
        container: $('.nt-content'),
        tabs: $('.nt-nav-tab-link'),

        activeView: null,

        mapView: null,
        objectsView: null,
        filtersView: null,
        aboutView: null,
        createView: null,

        routes: {
            '': 'base',
            'map': 'map',
            'banks': 'objects',
            'filters': 'filters',
            'about': 'about',
            /** unused:start */
            'more-info/:id': 'moreInfo',
            /** unused:end */
            '*other': 'base'
        },

        navigate: function(fragment, options) {
            options = options || {trigger: true, replace: true};
            Backbone.Router.prototype.navigate.call(this, fragment, options);
            return this;
        },

        switchToView: function(view, tabSelector) {
            if (this.activeView !== view) {
                this.tabs.removeClass('active').filter(tabSelector).addClass('active');
                if (this.activeView) {
                    this.activeView.detach();
                }
                this.activeView = view.attach(this.container);
            }
        },

        base: function() {
            this.navigate('map');
        },

        map: function() {
            window.app.utils.log('#map link clicked');
            this.switchToView(this.mapView || (this.mapView = new window.app.MapView()), '[href="#map"]');
            window.app.utils.trackPage('map');
        },

        objects: function() {
            window.app.utils.log('#banks link clicked');
            this.switchToView(this.objectsView || (this.objectsView = new window.app.ObjectsView()), '[href="#banks"]');
            window.app.utils.trackPage('objects');
        },

        filters: function() {
            window.app.utils.log('#filters link clicked');
            this.switchToView(this.filtersView || (this.filtersView = new window.app.FiltersView()), '[href="#filters"]');
            window.app.utils.trackPage('filters');
        },

        about: function() {
            window.app.utils.log('#about link clicked');
            this.switchToView(this.aboutView || (this.aboutView = new window.app.AboutView()), '[href="#about"]');
            window.app.utils.trackPage('about');
        }/** unused:start */,

        moreInfo: function(id) {
            window.app.utils.log('#more-info link clicked');
            this.switchToView(new window.app.MoreInfoView({id: id}));
        }
        /** unused:end */
    });

    window.app.router = new AppRouter();
})(jQuery, Backbone, window);
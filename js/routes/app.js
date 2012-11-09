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
        app.utils.log('#map link clicked');
        this.switchToView(this.mapView || (this.mapView = new app.MapView()), '[href="#map"]');
    },

    objects: function() {
        app.utils.log('#banks link clicked');
        this.switchToView(this.objectsView || (this.objectsView = new app.ObjectsView()), '[href="#banks"]');
    },

    filters: function() {
        app.utils.log('#filters link clicked');
        this.switchToView(this.filtersView || (this.filtersView = new app.FiltersView()), '[href="#filters"]');
    },

    about: function() {
        app.utils.log('#about link clicked');
        this.switchToView(this.aboutView || (this.aboutView = new app.AboutView()), '[href="#about"]');
    }/** unused:start */,

    moreInfo: function(id) {
        app.utils.log('#more-info link clicked');
        this.switchToView(new app.MoreInfoView({id: id}));
    }
    /** unused:end */
});

app.router = new AppRouter();
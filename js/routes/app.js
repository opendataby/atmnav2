var AppRouter = Backbone.Router.extend({
    container: $('.nt-content'),

    activeView: null,

    mapView: null,
    objectsView: null,
    filtersView: null,
    aboutView: null,
    createView: null,

    routes: {
        'map': 'map',
        'banks': 'objects',
        'filters': 'filters',
        'about': 'about',
        'create': 'create'
    },

    switchToView: function (view) {
        if (this.activeView !== view) {
            if (this.activeView) {
                this.activeView.detach();
            }
            this.activeView = view.attach(this.container);
        }
    },

    map: function () {
        app.utils.log('#map link clicked');
        this.switchToView(this.mapView || (this.mapView = new app.MapView()));
    },

    objects: function () {
        app.utils.log('#banks link clicked');
        this.switchToView(this.objectsView || (this.objectsView = new app.ObjectsView()));
    },

    filters: function () {
        app.utils.log('#filters link clicked');
        this.switchToView(this.filtersView || (this.filtersView = new app.FiltersView()));
    },

    about: function () {
        app.utils.log('#about link clicked');
        this.switchToView(this.aboutView || (this.aboutView = new app.AboutView()));
    },

    create: function () {
        app.utils.log('#create link clicked');
        $('.nt-nav-tab-link').removeClass('active');
        this.switchToView(this.createView || (this.createView = new app.CreateView()));
    }
});

app.Router = new AppRouter();
Backbone.history.start();
var AppRouter = Backbone.Router.extend({
    container: $('.nt-content'),

    activeView: null,

    mapView: null,
    objectsView: null,
    filtersView: null,
    aboutView: null,
    createView: null,

    baseRoute: 'map',

    routes: {
        'map': 'map',
        'banks': 'objects',
        'filters': 'filters',
        'about': 'about',
        'create': 'create',
        'more-info/:id': 'moreInfo'
    },

    navigate: function (fragment, options) {
        options = options || {trigger: true, replace: true};
        if (Backbone.history.getHash() === this.baseRoute) {
            options.replace = false;
        }
        Backbone.Router.prototype.navigate.call(this, fragment, options);
        return this;
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
    },

    moreInfo: function (id) {
        app.utils.log('#more-info link clicked');
        $('.nt-nav-tab-link').removeClass('active');
        this.switchToView(new app.MoreInfoView({id: id}));
    }
});

app.router = new AppRouter();
Backbone.history.start();
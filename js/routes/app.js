var app = app || {};

(function ($) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'map',
            'map': 'map',
            'banks': 'banks',
            'filters': 'filters',
            'about': 'about'
        },

        swithToView: function (view) {
            $('#content').html(view.el);
        },

        map: function () {
            if (!this.mapView) {
                this.mapView = new app.MapView();
            } else {
                this.mapView.updateMarkers();
            }
            this.swithToView(this.mapView);
        },

        banks: function () {
            if (!this.objectsView) {
                this.objectsView = new app.ObjectsView();
            }
            this.swithToView(this.objectsView);
        },

        filters: function () {
            if (!this.filtersView) {
                this.filtersView = new app.FiltersView();
            }
            this.swithToView(this.filtersView);
        },

        about: function () {
            if (!this.aboutView) {
                this.aboutView = new app.AboutView();
            }
            this.swithToView(this.aboutView);
        }
    });

    app.Router = new AppRouter();
    Backbone.history.start();

})(jQuery);
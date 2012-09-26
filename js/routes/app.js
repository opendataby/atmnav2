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
            app.utils.log('swithToView');

            $('#content').html(view.el);
        },

        map: function () {
            app.utils.log('#map link clicked');

            if (!this.mapView) {
                this.mapView = new app.MapView();
            } else {
                this.mapView.updateMarkers();
            }
            this.swithToView(this.mapView);
        },

        banks: function () {
            app.utils.log('#banks link clicked');

            if (this.objectsView) {
                this.objectsView.remove();
            }
            
            this.objectsView = new app.ObjectsView();
            this.swithToView(this.objectsView);
        },

        filters: function () {
            app.utils.log('#filters link clicked');

            if (this.filtersView) {
                this.filtersView.remove();
            }
            
            this.filtersView = new app.FiltersView();
            this.swithToView(this.filtersView);
        },

        about: function () {
            app.utils.log('#about link clicked');

            if (this.aboutView) {
                this.aboutView.remove();
            }
            
            this.aboutView = new app.AboutView();
            this.swithToView(this.aboutView);
        }
    });

    app.Router = new AppRouter();
    Backbone.history.start();

})(jQuery);
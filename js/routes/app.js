var app = app || {};

(function ($) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            'map': 'map',
            'banks': 'banks',
            'filters': 'filters',
            'about': 'about'
        },

        swithToView: function (view) {
            app.utils.log('utils:swithToView:start');

            $('#content').html(view.el);

            this.activeView = view;
            this.deleteHiddenViews();

            app.utils.log('utils:swithToView:end');
        },

        deleteHiddenViews: function () {
            app.utils.log('utils:deleteHiddenViews:start');
            var self = this;

            _.each(['filtersView', 'objectsView', 'aboutView'], function (viewName) {
                var view = self[viewName];

                if (view && view != self.activeView) {
                    app.utils.log(viewName + ' was deleted');
                    view.remove();
                }
            });

            app.utils.log('utils:deleteHiddenViews:end');
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

            this.objectsView = new app.ObjectsView();
            this.swithToView(this.objectsView);
        },

        filters: function () {
            app.utils.log('#filters link clicked');

            this.filtersView = new app.FiltersView();
            this.swithToView(this.filtersView);
        },

        about: function () {
            app.utils.log('#about link clicked');

            this.aboutView = new app.AboutView();
            this.swithToView(this.aboutView);
        }
    });

    app.Router = new AppRouter();
    Backbone.history.start();

})(jQuery);
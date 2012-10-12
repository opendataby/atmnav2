var app = app || {};

app.AboutView = Backbone.View.extend({
    make: function () {
        app.utils.log('about:make');

        return _.template($('#about-template').html())();
    }
});
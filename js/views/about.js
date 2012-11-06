app.AboutView = app.PageView.extend({
    make: function() {
        app.utils.log('about:make');

        return _.template($('#about-template').html())();
    }
});
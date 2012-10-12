var app = app || {};

app.AboutView = Backbone.View.extend({
    className: 'nt-about-page',

    initialize: function () {
        this.render();
    },

    render: function () {
        var template = _.template($('#about-template').html());
        this.$el.html(template);
    }
});
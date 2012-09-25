var app = app || {};

(function ($) {
    app.AboutView = Backbone.View.extend({
        initialize: function () {
            this.render();
        },

        render: function () {
            var template = _.template($('#about-template').html());
            this.$el.html(template);
        }
    });
})(jQuery);
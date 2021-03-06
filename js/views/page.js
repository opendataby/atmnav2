(function(Backbone, app) {
    app.PageView = Backbone.View.extend({
        attach: function(container) {
            this.$el.appendTo(container);
            this.delegateEvents();
            return this;
        },

        detach: function() {
            this.undelegateEvents();
            this.$el.detach();
            return this;
        }
    });
})(Backbone, window.app);
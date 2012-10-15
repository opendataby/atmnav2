app.MoreInfoView = app.PageView.extend({
    make: function () {
        app.utils.log('more-info:make');

        var item = {};
        // TODO: get item by id

        return _.template($('#more-info-template').html())(item);
    }
});
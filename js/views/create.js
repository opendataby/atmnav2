(function($, _, app) {
    app.CreateView = app.PageView.extend({
        _scroll: null,

        events: {
            'submit': 'onSubmit'
        },

        make: function() {
            app.utils.log('create:make');

            return _.template($('#create-template').html())();
        },

        onSubmit: function(event) {
            console.log('create:onSubmit');

            event.preventDefault();
            event.stopPropagation();

            var form = this.$el.find('.nt-create-form'),
                type = $('input[name=type]', form).val(),
                provider = $('input[name=provider]', form).val(),
                address = $('input[name=address]', form).val(),
                place = $('input[name=place]', form).val();

            if (!_.all([type, provider, address])) {
                app.utils.alert(tr('Please, fill the form'), tr('Alert'));
            } else {
                var onError = function() {
                    app.utils.alert(tr('Opps, try later'), tr('Error'));
                };

                var onSuccess = function(data) {
                    if (data.success) {
                        form.find('input').val('');
                        app.utils.alert(tr('Thank you for submit'), tr('Message'));
                    } else {
                        onError();
                    }
                };

                app.remote.submitPoint({
                    data: {
                        'type': type,
                        'provider': provider,
                        'address': address,
                        'place': place    
                    },
                    error: onError,
                    success: onSuccess
                });
            }
            return false;
        }
    });
})(jQuery, _, window.app);
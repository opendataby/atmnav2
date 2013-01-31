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

        initialize: function() {
            app.utils.log('create:initialize:start');

            var navigationBar = $('.nt-nav');

            document.addEventListener("hidekeyboard", function() {
                setTimeout(function() {
                    navigationBar.fadeIn(400);
                }, 250);
            }, false);

            document.addEventListener("showkeyboard", function() {
                navigationBar.hide();
            }, false);

            app.utils.log('create:initialize:end');
        },

        attach: function(container) {
            app.utils.log('create:attach:start');

            app.PageView.prototype.attach.call(this, container);
            this.toggleSubmitButton(true);

            app.utils.log('create:attach:end');
            return this;
        },

        toggleSubmitButton: function(enable) {
            var button = $('button', this.el);

            if (enable) {
                button.removeAttr('disabled');
            } else {
                button.attr('disabled', 'disabled');
            }
        },

        onSubmit: function(event) {
            console.log('create:onSubmit');

            event.preventDefault();
            event.stopPropagation();

            var self = this,
                form = this.$el.find('.nt-create-form'),
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
                        self.toggleSubmitButton(false);
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
                        'place': place,
                        'geo': JSON.stringify(app.utils.loadData('mapLastLocation'))
                    },
                    error: onError,
                    success: onSuccess
                });
            }
            return false;
        }
    });
})(jQuery, _, window.app);
var app = app || {};

(function ($) {
    app.settings = {
        debug: true,

        mapOptions: {
            zoom: 16,
            keyboardShortcuts: false,
            panControl: false,
            rotateControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },

        defaultLatLng: {
            lat: 53.902257,
            lng: 27.561640
        },

        filters: {
            'type:bank': 'Банк',
            'type:terminal': 'Инфокиоск',
            'type:exchange': 'Обмен валюты',
            'type:atm:currency:byr': 'Банкомат (BYR)',
            'type:atm:currency:rur': 'Банкомат (RUR)',
            'type:atm:currency:usd': 'Банкомат (USD)',
            'type:atm:currency:eur': 'Банкомат (EUR)'
        },

        objects: {
            'spec:all': 'Показывать все банки',
            'spec:related': 'Показывать банки-партнеры',
            'belinvest': 'Белинвестбанк',
            'prior': 'Приорбанк'
        },

        types: {
            'atm': 'банкомат',
            'bank': 'банк',
            'terminal': 'инфокиоск',
            'exchange': 'пункт обмена валют'
        },

        serverUrl: 'http://atmnav-server.appspot.com'
    }
})(jQuery);
var app = app || {};

app.settings = {
    debug: true,

    mapOptions: {
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
        markerZoomAnimation: false
    },

    geolocationOptions: {
        enableHighAccuracy: true
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

    defaultFilters: ['type:atm:currency:byr'],

    objects: {
        'spec:all': 'Показывать все банки',
        //'spec:related': 'Показывать банки-партнеры',
        'belinvest': 'Белинвестбанк',
        'prior': 'Приорбанк'
    },

    defaultObjects: ['spec:all'],

    types: {
        'atm': 'банкомат',
        'bank': 'банк',
        'terminal': 'инфокиоск',
        'exchange': 'пункт обмена валют'
    },

    serverUrl: 'http://atmnav-server.appspot.com'
};
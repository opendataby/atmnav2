var app = app || {};

app.settings = {
    debug: true,

    version: '2.0',

    vibrateMilliseconds: 40,
    ajaxTimeout: 10000, // 10 sec

    mapTileUrlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

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

    filters: [
        'type:bank',
        'type:terminal',
        'type:exchange',
        'type:atm:currency:byr',
        'type:atm:currency:rur',
        'type:atm:currency:usd',
        'type:atm:currency:eur'
    ],

    defaultFilters: [
        'type:atm:currency:byr'
    ],

    objects: [
        'spec:all',
        //'spec:related',
        'absolut',
        'alfa',
        'belagroprom',
        'belarus',
        'belgazprom',
        'belinvest',
        'bnb',
        'belros',
        'belswiss',
        'bps',
        'bta',
        'mm',
        'mtb',
        'prior',
        'techno'
    ],

    defaultObjects: [
        'spec:all'
    ],

    serverUrl: 'http://atmnav-server.appspot.com',

    language: {
        'default': 'ru'
    }
};
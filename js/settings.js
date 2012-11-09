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
        'spec:related',
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

    related: {
        'absolut': [],
        'alfa': ['bsb', 'bve', 'mm', 'rrb', 'techno'],
//        'bbsb': ['belarus', 'belinvest', 'bps', 'prior'],
        'belagroprom': ['belarus', 'belinvest', 'bps', 'prior'], // belapb
        'belarus': ['belagroprom', 'belinvest', 'bps'],
        'belgazprom': [],
        'belinvest': ['belagroprom', 'belarus'],
        'belros': [],
//        'bit': [],
        'bnb': [],
        'bps': ['belarus', 'prior'],
        'belswiss': ['alfa', 'mm', 'techno'], //bsb ['bveb']
        'bta': ['prior'],
//!!!        'bveb': [],
//        'credex': [],
//!!!        'delta': [],
//        'euro': [],
//        'fransa': [],
//        'h': [],
//!!!        'homecredit': [],
//        'irb': [],
        'mm': ['alfa', 'bsb', 'tehno', 'rrb'], // ['bveb']
        'mtb': ['prior', 'bta'], // mt
//        'nbrb': [],
//!!!        'paritet': [],
        'prior': ['belagroprom', 'bps', 'bta', 'mtb'],
//!!!        'rrb': ['alfa', 'bsb', 'bveb', 'mm', 'tehno', 'rrb'],
//!!!        'sbb': [],
        'techno': ['belarus', 'belgazprom', 'belinvest', 'bps', 'prior'] // tb ['bveb', 'nbrb']
//        'tc': ['belarus', 'belgazprom', 'belinvest', 'bps', 'bveb', 'prior'], // ['nbrb']
//!!!        'trust': ['belagroprom', 'belarus', 'belgazprom', 'belinvest', 'bnb', 'bps', 'bsb', 'bveb', 'mm', 'mtb', 'paritet', 'prior'], // ['fransa', 'nbrb']
//!!!        'vtb': [],
//!!!        'zepter': [],
    },

    defaultObjects: [
        'spec:all'
    ],

    serverUrl: 'http://atmnav-server.appspot.com',

    language: {
        'default': 'ru'
    }
};
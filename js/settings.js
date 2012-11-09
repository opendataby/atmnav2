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
        'belapb',
        'belarus',
        'belgazprom',
        'belinvest',
        'belros',
        'bnb',
        'bps',
        'bsb',
        'bta',
        'bveb',
        'credex',
        'delta',
        'fransa',
        'homecredit',
        'mm',
        'mt',
        'paritet',
        'prior',
        'rrb',
        'sbb',
        'tb',
        'trust',
        'vtb',
        'zepter'
    ],

    related: {
        'absolut': [],
        'alfa': ['bsb', 'bve', 'mm', 'rrb', 'tb'],
//        'bbsb': ['belarus', 'belinvest', 'bps', 'prior'],
        'belapb': ['belarus', 'belinvest', 'bps', 'prior'],
        'belarus': ['belapb', 'belinvest', 'bps'],
        'belgazprom': [],
        'belinvest': ['belapb', 'belarus'],
        'belros': [],
//        'bit': [],
        'bnb': [],
        'bps': ['belarus', 'prior'],
        'bsb': ['alfa', 'bveb', 'mm', 'tb'],
        'bta': ['prior'],
        'bveb': [],
        'credex': [],
//!!!        'delta': [],
//        'euro': [],
        'fransa': [],
//        'h': [],
        'homecredit': [],
//        'irb': [],
        'mm': ['alfa', 'bsb', 'bveb', 'tehno', 'rrb'],
        'mt': ['prior', 'bta'],
//        'nbrb': [],
        'paritet': [],
        'prior': ['belapb', 'bps', 'bta', 'mt'],
        'rrb': ['alfa', 'bsb', 'bveb', 'mm', 'tehno', 'rrb'],
//!!!        'sbb': [],
        'tb': ['belarus', 'belgazprom', 'belinvest', 'bps', 'bveb', 'prior'], // ['nbrb']
//        'tc': ['belarus', 'belgazprom', 'belinvest', 'bps', 'bveb', 'prior'], // ['nbrb']
        'trust': ['belapb', 'belarus', 'belgazprom', 'belinvest', 'bnb', 'bps', 'bsb', 'bveb', 'fransa', 'mm', 'mt', 'paritet', 'prior'], // ['nbrb']
        'vtb': [],
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
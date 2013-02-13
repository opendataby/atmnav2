(function(app) {
    app.settings = {
        debug: true,

        version: '2.2.0',

        vibrateMilliseconds: 40,
        ajaxTimeout: 15000, // 15 sec
        submitTimeout: 5000, // 5 sec

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
            timeout: 15000, // 15 sec
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
            'bve',
            'belgazprom',
            'belinvest',
            'bbmb',
            'bnb',
            'belros',
            'belswiss',
            'bps',
            'bta',
            'vtb',
            'delta',
            'euro',
            'credex',
            'mm',
            'mtb',
            'paritet',
            'prior',
            'rrb',
            'sbb',
            'techno',
            'trust',
            'fransa',
            'homecredit',
            'zepter'
        ],

        defaultObjects: [
            'spec:related',
            'belinvest'
        ],

        related: {
            // verified
            'alfa': ['mm', 'belswiss', 'rrb', 'techno'],
            'belagroprom': ['belarus', 'prior', 'belinvest'],
            'belinvest': ['belarus', 'belagroprom'],
            'belgazprom': [],
            'belros': [],
            'belswiss': ['alfa', 'bve', 'mm', 'techno', 'rrb'],
            'bps': ['belarus', 'prior'],
            'bta': ['prior'],
            'bve': ['mm', 'techno', 'alfa', 'rrb', 'belswiss', 'sbb'],
            'homecredit': [],
            'prior': ['belagroprom', 'mtb', 'bta', 'bps'],
            'mm': ['alfa', 'rrb', 'techno', 'bve', 'belswiss'],
            'mtb': ['prior', 'bta'],
            'rrb': ['bve', 'mm', 'techno', 'belswiss', 'alfa'],
            'techno': ['bve', 'mm', 'alfa', 'belswiss', 'rrb'],

            // not verified
            'absolut': [],
            'belarus': ['belinvest', 'bps', 'belagroprom'],
            'bnb': [],
            'delta': [],
            'fransa': [],
            'paritet': [],
            'sbb': [],
            'true': [],
            'vtb': [],
            'credex': [],
            'zepter': []
        },

        serverUrl: 'http://atmnav-server.appspot.com',
        submitUrl: 'http://atmnav-server.appspot.com/submit/',

        language: {
            'default': 'ru'
        }
    };
})(window.app);

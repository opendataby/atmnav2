(function(app) {
    app.settings = {
        debug: true,

        version: '2.2.1',

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

        objectUrls: {
            'absolut': 'http://www.absolutbank.by/',
            'alfa': 'http://www.alfabank.by/',
            'belagroprom': 'http://www.belapb.by/',
            'belarus': 'http://www.belarusbank.by/',
            'bve': 'http://www.bveb.by/',
            'belgazprom': 'http://www.belgazprombank.by/',
            'belinvest': 'http://www.belinvestbank.by/',
            'bbmb': 'http://www.bbsb.by/',
            'bnb': 'http://www.bnb.by/',
            'belros': 'http://www.belrosbank.by/',
            'belswiss': 'http://www.bsb.by/',
            'bps': 'http://www.bps-sberbank.by/',
            'bta': 'http://www.btabank.by/',
            'vtb': 'http://www.vtb-bank.by/',
            'delta': 'http://www.deltabank.by/',
            'euro': 'http://www.eurobank.by/',
            'credex': 'http://www.credexbank.by/',
            'mm': 'http://www.mmbank.by/',
            'mtb': 'http://www.mtbank.by/',
            'paritet': 'http://www.paritetbank.by/',
            'prior': 'http://www.priorbank.by/',
            'rrb': 'http://www.rrb.by/',
            'sbb': 'http://www.sbb.by/',
            'techno': 'http://www.tb.by/',
            'trust': 'http://www.trustbank.by/',
            'fransa': 'http://www.fransabank.by/',
            'homecredit': 'http://www.homecredit.by/',
            'zepter': 'http://www.zepterbank.by/'
        },

        serverUrl: 'http://atmnav-server.appspot.com',
        submitUrl: 'http://atmnav-server.appspot.com/submit/',

        language: {
            'default': 'ru'
        }
    };
})(window.app);

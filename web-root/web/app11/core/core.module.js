'use strict';

(function() {

    angular.module('core', [
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'ngTouch',
        'ngComponentRouter',
        'ui.bootstrap',
        'ui.select',
        'templates',
        'focus-if',

        // Core Services, filters etc.
        require('./domain').name,
        require('./services').name,

        // components
        require('../components/sblocapp').name,
        require('../components/loandetails').name,
        require('../components/loanListing').name,
        require('../components/login').name,
        require('../components/loader').name,
        require('../components/allowPattern').name,
        require('../components/custodian').name

    ]);

})();

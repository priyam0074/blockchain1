'use strict';

(function() {

    require('angular-cookies');
    require('angular-animate');
    require('angular-sanitize');
    require('angular-touch');
    require('ng-focus-if');
    angular.module("templates", []);
    require('../templates/templates.js');

    require('./core.module');

    module.exports = angular.module('core');

})();

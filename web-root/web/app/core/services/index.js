'use strict';

(function() {

    require('./services.module');
    require('./userService');
    require('./requestInterceptor');
    require('./loanService');

    module.exports = angular.module('core.services');

})();

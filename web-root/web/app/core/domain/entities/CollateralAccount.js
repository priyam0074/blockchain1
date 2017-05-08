'use strict';

(function() {

    angular.module('core.domain')
        .factory('CollateralAccount', [function() {
            var CollateralAccount = function(data) {
                if (data instanceof Object) {
                    this.id = data.id;
                    this.name = data.name;
                    this.count = data.count;
                }
            };

            CollateralAccount.prototype = {

            };

            return CollateralAccount;
        }]);

})();

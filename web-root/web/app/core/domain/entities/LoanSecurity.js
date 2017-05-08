'use strict';

(function() {

    angular.module('core.domain')
        .factory('LoanSecurity', [function() {
            var LoanSecurity = function(data) {
                if (data instanceof Object) {
                    this.id = data.securityId;
                    this.name = data.securityName;
                    this.price = data.securityExistingPrice;
                    this.newPrice = data.securityNewPrice;
                }
            };

            LoanSecurity.prototype = {

            };

            return LoanSecurity;
        }]);

})();

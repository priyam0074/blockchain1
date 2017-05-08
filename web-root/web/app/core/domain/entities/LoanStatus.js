'use strict';

(function() {

    angular.module('core.domain')
        .factory('LoanStatus', [function() {
            var LoanStatus = function(data) {
                if (data instanceof Object) {
                    this.id = data.id;
                    this.value = data.value;
                }
            };

            LoanStatus.prototype = {

            };
            return LoanStatus;
        }]);


})();
'use strict';

(function() {

    angular.module('core.domain')
        .factory('Person', [function() {
            var Person = function(data) {
                if (data instanceof Object) {
                    this.firstName = data.firstName;
                    this.middleName = data.middleName;
                    this.lastName = data.lastName;
                    this.emailId = data.emailId;
                    this.phone = data.phone;
                    this.isExistingBorrower = data.isExistingBorrower;
                }
            };

            Person.prototype = {

            };

            return Person;
        }]);

})();

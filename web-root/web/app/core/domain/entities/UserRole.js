'use strict';

(function() {



    angular.module('core.domain')
        .factory('UserRole', [function() {
            var UserRole = function(data) {
                if (data instanceof Object) {
                    this.roleId = data.roleId;
                    this.role = data.role;
                }
            };

            UserRole.prototype = {

            };
            return UserRole;
        }]);


})();

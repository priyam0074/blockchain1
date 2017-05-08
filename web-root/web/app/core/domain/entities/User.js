'use strict';

(function() {

    angular.module('core.domain')
        .factory('User', ['EntityMapper', 'UserRole', function(EntityMapper, UserRole) {
            var User = function(data) {
                if (data instanceof Object) {
                    this.userName = data.userName;
                    this.id = data.id;
                    this.firstName = data.firstName;
                    this.lastName = data.lastName;
                    this.emailId = data.emailId;
                    this.roles = new EntityMapper(UserRole).toEntities(data.roles);
                    this.token = data.token;
                    this.tokenExpiry = data.tokenExpiry;
                }
            };

            User.prototype = {
                getFullName: function(isFirstNameFirst) {
                    if (isFirstNameFirst === true) {
                        return this.firstName & this.lastName ? ' ' + this.lastName : '';
                    } else {
                        return this.lastName & this.firstName ? ', ' + this.firstName : '';
                    }
                }
            };
            return User;
        }]);


})();

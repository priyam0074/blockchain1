'use strict';

(function() {

    angular.module('core.domain')
        .factory('LoginInfo', [function() {
            var LoginInfo = function(data) {
                if (data instanceof Object) {
                    this.userName = data.userName;
                    this.password = data.password;
                }
            };

            LoginInfo.prototype = {

            };
            return LoginInfo;
        }]);

})();

'use strict';

(function() {

    var loginController = function(LoginInfo, userService, $router,$rootScope) {
        console.log("ROUTER LOGIN: ", $router);
        var $ctrl = this;
        this.loginInfo = new LoginInfo();
        this.isLoginSuccess = false;
        this.loginMessage = '';
        

        this.$routerOnActivate = function() {
        };  

        this.loginSubmit = function() {
            userService.login($ctrl.loginInfo).then(function(response) {
                $ctrl.loginMessage = response.message;
                $ctrl.isLoginSuccess = true;
                $router.navigate(['LoanListing']);
            }, function(rejection) {
                $ctrl.loginMessage = rejection.message;
                $ctrl.isLoginSuccess = false;
            });
        };

        $rootScope.$broadcast('navButton',{status:false});
    };
    loginController.$inject = ['LoginInfo', 'userService', '$router','$rootScope'];

    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'login/login.html',
        controller: loginController,
        $canActivate: ['$nextInstruction', '$prevInstruction', 'userService', function($nextInstruction, $prevInstruction, userService) {
            return userService.isAnonymous();
        }]
    };

    module.exports = angular.module('login')
        .component('login', componentConfig);

})();

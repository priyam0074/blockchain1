'use strict';

(function() {

    function accountController(loanService, $timeout) {
        var $ctrl = this;
        //var selectedAccountList = [];
        $ctrl.noAccountSelectedMessage = false;


        

        $ctrl.enableSecuritySection = function(collateralAccount) {
            $ctrl.noAccountSelectedMessage = false;
            $ctrl.currentSelectedAccount = collateralAccount;
            //selectedAccountList = getSelectedCollateralAccounts($ctrl.collateralAccountList);
            $ctrl.selectedAccountList = getSelectedCollateralAccounts($ctrl.collateralAccountList);
            loanService.selectedAccountList = getSelectedCollateralAccounts($ctrl.collateralAccountList);

            if ($ctrl.selectedAccountList.length) {
                $timeout(function(){
                    $ctrl.securitySectionEnable();    
                });
                
            } else {
                $ctrl.noAccountSelectedMessage = true;
                //$ctrl.currentSelectedAccount = collateralAccount;
                //$ctrl.removeSecuritySection(collateralAccount); 
                $ctrl.removeSecuritySection();
            }
        };

        $ctrl.isCollateralAccountSelected = function(){
            return getSelectedCollateralAccounts($ctrl.collateralAccountList).length > 0;
        };

        function getSelectedCollateralAccounts(accountList) {
            var selectedAccounts = accountList.filter(function(account) {
                return account.selected === true;
            });
            return selectedAccounts;
        }

    }

    accountController.$inject = ['loanService', '$timeout'];

    var config = {
        bindings: {
            collateralAccountList: '=',
            selectedAccountList: '=',
            fetchingDataFlag: '=',
            loan: '=',
            currentSelectedAccount:'=',
            securitySectionEnable: '&',
            removeSecuritySection: '&',
            isInputControls: '<',
            isCalculateCollateral: '<'
        },
        templateUrl: 'loandetails/collateralinfo/account/account.html',
        controller: accountController
    };

    module.exports = angular.module('loandetails').component('account', config);

})();

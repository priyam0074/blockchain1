'use strict';

(function() {

    function securityController(loanService,$rootScope, EntityMapper, CollateralPosition) {

        var $ctrl = this;
        $ctrl.showLoanFormSection = false;
        //$ctrl.loanApprovalFlag = false;
        $ctrl.positionColumns = ["LOAN ID",
            "SECURITY NAME",
            "CUSIP",
            "QUANTITY",
            "PRICE",
            "MV",
            "COLLATERAL VALUE"
        ];

        $ctrl.$onInit = function() {
            if ($ctrl.loan.id) {
                $ctrl.showPositionFlag = true;
                $ctrl.securityDetails = {};
                $ctrl.securityDetails.columns = $ctrl.positionColumns;
                // Changes for UI Demo start
                $ctrl.loan.collateralPositions = $ctrl.loan.collateralPositions || [];
                $ctrl.loan.collateralAccounts.forEach(function(item){
                    item.collateralPositions.forEach(function(collateralPosition){
                        $ctrl.loan.collateralPositions.push(new EntityMapper(CollateralPosition).toEntity(collateralPosition));
                    });
                });
                // Changes for UI Demo end
                $ctrl.securityDetails.data = $ctrl.loan.collateralPositions;
                $ctrl.loan.collateralValue = loanService.calculateTotalCollateralAmount($ctrl.securityDetails.data); 
                $ctrl.loanApprovalFlag = ($ctrl.loan.collateralValue * 0.8) >= parseInt($ctrl.loan.loanAmount);
                
            }
        };

        $rootScope.$on('showApprovalButton',function(evt, collateralValue){
                $ctrl.loanApprovalFlag = (collateralValue.value * 0.8) >= parseInt($ctrl.loan.loanAmount);
        });

    }

    securityController.$inject = ['loanService','$rootScope', 'EntityMapper', 'CollateralPosition'];

    var config = {
        bindings: {
            securityDetails: '=',
            loanApprovalFlag:'=',
            loan: '=',
            showPositionFlag: '=',
            userRole: '<',
            loanStatus: '<'
        },
        templateUrl: 'loandetails/collateralinfo/security/security.html',
        controller: securityController
    };

    module.exports = angular.module('loandetails').component('security', config);


})();

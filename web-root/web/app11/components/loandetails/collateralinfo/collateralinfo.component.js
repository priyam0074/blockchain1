'use strict';

(function() {

    var collateralInfoController = function(loanService, EntityMapper, CollateralAccount, CollateralPosition,$rootScope) {

        var $ctrl = this;
        $ctrl.loan.collateralValue = 0;
        $ctrl.showPositionFlag = false;
        $ctrl.loanApprovalFlag = false;
        $ctrl.securityDetails = {};
        $ctrl.accountChecked = false;
        $ctrl.fetchingDataFlag = false;
        $ctrl.positionColumns = ["LOAN ID",
            "SECURITY NAME",
            "CUSIP",
            "QUANTITY",
            "PRICE",
            "MV",
            "COLLATERAL VALUE"
        ];
        $ctrl.currentSelectedAccount = {};

        $ctrl.showSecuritySection = function() {
            //TODO
            $ctrl.loan.collateralAccounts = new EntityMapper(CollateralAccount).toEntities(loanService.selectedAccountList);
            /*var collateralAccountIds = [];
            for (var index = 0, len = loanService.selectedAccountList.length; index < len; index++) {
                collateralAccountIds.push(loanService.selectedAccountList[index].id);
            }*/
            //console.log($ctrl.loan.collateralAccounts[0].collateralPositions.length);
           /* var params = {
                collateralAccountID : $ctrl.loan.collateralAccounts[0].id,
                collateralAccountCount : $ctrl.loan.collateralAccounts[0].count || $ctrl.collateralAccountList[0].collateralPositions.length
            };*/
            var params = null;
            if($ctrl.currentSelectedAccount && $ctrl.currentSelectedAccount.selected){
                params = {
                    collateralAccountID: $ctrl.currentSelectedAccount.id,
                    collateralAccountCount: $ctrl.currentSelectedAccount.count
                };
                 loanService.getAccountSecuritiesOnCreate(params)
                .then(function(response){
                    
                    $ctrl.loan.collateralPositions = $ctrl.loan.collateralPositions || [];

                    response.data.collateralAccounts[0].collateralPositions.forEach(function(item){
                        item.collateralAccountId=response.data.collateralAccounts[0].id;
                        $ctrl.loan.collateralPositions.push(new EntityMapper(CollateralPosition).toEntity(item)); 
                    });
                        //$ctrl.loan.collateralPositions.push(new EntityMapper(CollateralPosition).toEntities(response.data.collateralAccounts[0].collateralPositions));
                    
                    $ctrl.loan.collateralValue = loanService.calculateTotalCollateralAmount($ctrl.loan.collateralPositions);
                    $ctrl.loanApprovalFlag = ($ctrl.loan.collateralValue * 0.8) >= parseInt($ctrl.loan.loanAmount);
                    if(!$ctrl.loan.id){
                        $rootScope.$broadcast('showApprovalButton',{value:$ctrl.loan.collateralValue});
                    }
                    $ctrl.securityDetails.data = $ctrl.loan.collateralPositions;


                    $ctrl.securityDetails.columns = $ctrl.positionColumns;
                    //$ctrl.securityDetails.data = $ctrl.loan.collateralPositions;
                    $ctrl.enableSecuritySection = $ctrl.showPositionFlag = true;

                    $ctrl.enableFormSubmissionBtn();
                });
            }
            else{
                    for(var index = 0; index < $ctrl.securityDetails.data.length; index++){

                        if($ctrl.currentSelectedAccount.id === parseInt($ctrl.securityDetails.data[index].collateralAccountId)){
                            $ctrl.securityDetails.data.splice(index, $ctrl.currentSelectedAccount.count);
                        }
                        $ctrl.loan.collateralValue  = loanService.calculateTotalCollateralAmount($ctrl.securityDetails.data);
                    }
            }



           
            


            /*var params = {
                borrowerEmailId: $ctrl.loan.borrower.emailId,
                collateralAccountIds: collateralAccountIds
            };*/
            // Changes for UI Demo start - to get collateralSecurities as per collateral accounts
           /* $ctrl.loan.collateralAccounts.forEach(function(items){
              $ctrl.loan.collateralPositions = new EntityMapper(CollateralPosition).toEntities(items.collateralPositions); 
             });*/
            
        };

            

            /*loanService.getAccountSecurities(params).then(function(response) {
                $ctrl.loan.collateralPositions = new EntityMapper(CollateralPosition).toEntities(response.data['securityDetails'].data);
                $ctrl.loan.collateralValue = loanService.calculateTotalCollateralAmount($ctrl.loan.collateralPositions);
                if(!$ctrl.loan.id){
                $rootScope.$broadcast('showApprovalButton',{value:$ctrl.loan.collateralValue});
                }
                $ctrl.securityDetails = response.data['securityDetails'];
                $ctrl.enableSecuritySection = $ctrl.showPositionFlag = true;
                $ctrl.enableFormSubmissionBtn();
            });
        };*/

        function loadAccountListSection(selectedCollateralAccounts, collateralAccountList) {
            angular.forEach(selectedCollateralAccounts, function(selectedAccount) {
                angular.forEach(collateralAccountList, function(account) {
                    if (selectedAccount.id === account.id) {
                        account.selected = true;
                    }
                });
            });
            return collateralAccountList;
        }

        //TODO: Life hooks
        this.$onInit = function() {

            /*console.log($ctrl.loan);
            $ctrl.collateralAccountList = new EntityMapper(CollateralAccount).toEntities($ctrl.loan.collateralAccounts);
            $ctrl.enableSecuritySection = false;*/
            $ctrl.loan.status = $ctrl.loan.status? $ctrl.loan.status.replace(/[^a-z\.]+/gi, ""):undefined;
            if($ctrl.loan.status === loanService.getLoanStates().pendingConsent || 
               $ctrl.loan.status === loanService.getLoanStates().pendingAcknowledgement || 
               $ctrl.loan.status === loanService.getLoanStates().pendingApproval ||
               $ctrl.loan.status === loanService.getLoanStates().approved){
                $ctrl.collateralAccountList = $ctrl.loan.collateralAccounts;
                $ctrl.collateralAccountList.forEach(function(item){
                  item.Checked = true;
                  item.selected = true;
                });
            }else{
                if(!$ctrl.loan.collateralAccounts.length){
                    $ctrl.fetchingDataFlag = true;
                    loanService.getCollateralAccountList($ctrl.loan.borrower.phone).then(function(response) {
                    $ctrl.fetchingDataFlag = false;
                    $ctrl.collateralAccountList = new EntityMapper(CollateralAccount).toEntities(response.data['collateralAccounts']);
                    if ($ctrl.loan.id) {
                        $ctrl.collateralAccountList = loadAccountListSection($ctrl.loan.collateralAccounts,
                            $ctrl.collateralAccountList);
                        }
                    });
                } else{
                    $ctrl.collateralAccountList = $ctrl.loan.collateralAccounts;
                }
                $ctrl.enableSecuritySection = false;  
            }
            
            // Changes for UI Demo ends - to get collateral accounts for loan response
        };
    };

    collateralInfoController.$inject = ['loanService', 'EntityMapper',
        'CollateralAccount', 'CollateralPosition','$rootScope'
    ];

    var collateralInfoConfig = {
        bindings: {
            loan: '=',
            saveLoan: '&',
            enableFormSubmissionBtn: '&',
            isInputControls: '<',
            isCalculateCollateral: '<'
        },
        templateUrl: 'loandetails/collateralinfo/collateralinfo.html',
        controller: collateralInfoController
    };

    angular.module('loandetails').component('collateralInfo',
        collateralInfoConfig);

})();

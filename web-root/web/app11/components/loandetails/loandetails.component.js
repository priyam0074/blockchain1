'use strict';

(function() {

    var loandetailsController = function(loanService, EntityMapper, Loan, $timeout, $rootScope, $anchorScroll, $location, $router, LoanStatus, userService) {
        var $ctrl = this;
        $ctrl.closeOtherAccordian = $ctrl.openLoanInfoSection = $ctrl.disableDraftButton = $ctrl.disableConsentButton = $ctrl.disableCollateralInfoSection = true;
        $ctrl.openCollateralInfoSection = false;
        $ctrl.loan = new EntityMapper(Loan).toEntity({});
        $ctrl.successFlag = $ctrl.errorFlag = false;
        $ctrl.isExistingBorrower = false;
        $ctrl.loanStatus = false;
        var user = userService.getLoggedInUser();
        $ctrl.loanStates = loanService.getLoanStates();
        $ctrl.UserRoles = userService.getUserRoles();
        $ctrl.userActions = userService.getUserActions();
        $ctrl.successMsg = {};
        $ctrl.successMsg.delay = 5000;

        $ctrl.currentUserRole = user && (user.roles instanceof Array) && user.roles[0].role;

        function enableControls(userRole, loanStatus) {
            loanStatus = loanStatus.replace(/[^a-z\.]+/gi, "");
            switch(userRole) {
                case $ctrl.UserRoles.financialAdvisor:
                    if (loanStatus === $ctrl.loanStates.pendingConsent) {
                        $ctrl.isLoanInfoSaveAndContinue = true; 
                        $ctrl.isSaveDraft = true;
                        $ctrl.isSendConsent = true; 
                        $ctrl.disableConsentButton = false;
                        $ctrl.isCalculateCollateral = true; 
                        $ctrl.loan.borrower.isExistingBorrower = false;
                        $ctrl.isInputControls = $ctrl.loan.borrower.isExistingBorrower;
                        $ctrl.isApprove = false;
                    } 
                    else if(loanStatus === $ctrl.loanStates.pendingApproval) {
                        $ctrl.isApprove = true;
                        $ctrl.isInputControls = true; 
                    }
                    else {
                        $ctrl.isLoanInfoSaveAndContinue = false;    
                        $ctrl.isSaveDraft = false;
                        $ctrl.isSendConsent = false; 
                        $ctrl.isCalculateCollateral = false;
                        $ctrl.isInputControls = true;
                        $ctrl.isApprove = false;
                    }
                    $ctrl.isAcknowledge = true;
                    //$ctrl.isApprove = false;
                    break;
                case $ctrl.UserRoles.borrower:
                    if (loanStatus === $ctrl.loanStates.pendingAcknowledgement) {
                        $ctrl.isAcknowledge = false;                        
                    } else if (loanStatus === $ctrl.loanStates.approved){
                        $ctrl.isWithdrawn = true;
                        $ctrl.isAcknowledge = true;   
                    } else {
                        $ctrl.isAcknowledge = true;                        
                    }
                    $ctrl.isLoanInfoSaveAndContinue = false; 
                    $ctrl.isSaveDraft = false;
                    $ctrl.isSendConsent = false; 
                    $ctrl.isCalculateCollateral = false; 
                    $ctrl.isApprove = false;
                    $ctrl.isInputControls = true;
                    break;
            }
        }   

        this.$routerOnActivate = function(next) {
            loanService.getUsesOfLoanProceeds().then(function(response) {
                $ctrl.useOfLoanProceeds = response.data['useOfLoanProceeds'];
                var loanId = next && next.params && next.params.id;

                if (loanId) {      
                    $ctrl.disableCollateralInfoSection = false;              
                    if($ctrl.UserRoles.borrower !== $ctrl.currentUserRole){
                        loanService.getLoanDetails(loanId).then(function(response) {
                            $ctrl.loan = response.data;
                            $ctrl.loan.loanAmount = $ctrl.loan.amountAvailableToBorrow;
                            enableControls($ctrl.currentUserRole, $ctrl.loan.status);
                            //enableControls($ctrl.currentUserRole, $ctrl.loanStates.pendingConsent);
                            $rootScope.$broadcast('enableRateSection', { loanData: $ctrl.loan });
                            $ctrl.openCollateralInfoSection = true;
                        });
                    } else {
                        loanService.getLoanDetailsForBorrower(loanId).then(function(response) {
                            $ctrl.loan = response.data;
                            $ctrl.loan.loanAmount = $ctrl.loan.amountAvailableToBorrow;
                            enableControls($ctrl.currentUserRole, $ctrl.loan.status);
                            //enableControls($ctrl.currentUserRole, $ctrl.loanStates.pendingConsent);
                            $rootScope.$broadcast('enableRateSection', { loanData: $ctrl.loan });
                            $ctrl.openCollateralInfoSection = true;
                        });
                    }
                } else {
                    enableControls($ctrl.currentUserRole, $ctrl.loanStates.pendingConsent);
                }
            });
        };

        /*$ctrl.navigateTo = function(location){
                $timeout(function(){
                        $router.navigate([location]);
                  }, $ctrl.successMsg.delay);
        };*/
        $ctrl.expandCollateralInfo = function() {
            $ctrl.openCollateralInfoSection = !$ctrl.openCollateralInfoSection;
            $ctrl.disableCollateralInfoSection = false;
        };
        $ctrl.approveLoan = function(){
            var reqObj = {
                loanId : $ctrl.loan.id,
                action : $ctrl.userActions.lender
            };

            loanService.approveLoanData(reqObj).then(function(response) {
                if (response.data.success && response.data.success === true) {
                    $ctrl.successFlag = true;
                    $ctrl.successMsg.value = "Loan with ID "+ $ctrl.loan.id+" has been successfully approved";  
                   //$router.navigate(['LoanListing']);
                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });
        };
        
        $ctrl.getWithdrawlAmount = function(){
            console.log($ctrl.abc);
            var withdrwalObj = {};
            withdrwalObj.loanId = $ctrl.loan.id;
            withdrwalObj.amount = $ctrl.abc;
            $ctrl.withdrawErrorMsg = false;
            
            loanService.withdrawAmount(withdrwalObj).then(function(response){
                if(response.data.success && response.data.success === true){
                   
                    if ( $ctrl.loan.outstanding < $ctrl.abc){
                         $ctrl.successMsg.value = "Loan with ID "+ $ctrl.loan.id+" has failed withdrawl" ; 
                         $ctrl.withdrawErrorMsg = true;
                     }
                     else {
                         $ctrl.successFlag = true;
                         $ctrl.successMsg.value = "Loan with ID "+ $ctrl.loan.id+" has been successfully withdraw Amount" +
                         $ctrl.abc;
                }

                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });

        };

        $ctrl.getExistingBorrowerDetails = function(){
            loanService.getExistingBorrowerDetails({phone:$ctrl.loan.borrower.existingPhone}).then(function(response){
                if(response.status === 200 && response.data){
                    var resp = response.data;
                    $ctrl.loan.borrower.phone = resp.phone;
                    $ctrl.loan.borrower.email = resp.email;
                    $ctrl.loan.borrower.firstName = resp.fname;
                    $ctrl.loan.borrower.lastName = resp.lname;
                    $ctrl.loan.borrower.middleName = resp.mname;
                    $ctrl.loan.borrower.emailId = resp.email;
                    $ctrl.loan.borrower.phone = resp.mobile;
                }
            });
        };

        $ctrl.acknowledgeLoan = function(){
             var reqObj = {
                loanId : $ctrl.loan.id,
                action : $ctrl.userActions.borrower
            };
           
            loanService.acknowledgeLoanData(reqObj).then(function(response) {
                if (response.data.success && response.data.success === true) {
                  $ctrl.successFlag = true;
                  $ctrl.successMsg.value = "Loan with ID "+ $ctrl.loan.id+" has been successfully sent for approval";
                  //$ctrl.navigateTo('LoanListing');
                  //$router.navigate(['LoanListing']);
                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });
        };

        function setMockValuesForNewLoan(){
            // used for setting the mock values in the saveloan request object
            // tobe removed in future
            $ctrl.loan.status = "pendingConsent";
            $ctrl.loan.creditLimit = "creditLimit";
            $ctrl.loan.outstanding = "21000";
            $ctrl.loan.creditLineExcess = "creditLineExcess";
            $ctrl.loan.amountAvailableToBorrow = "10000";
            $ctrl.loan.marginCallAmount = "0";
            $ctrl.loan.marginCallDueDate = "NA";
            $ctrl.loan.marketValue = "marketValue";
            $ctrl.loan.lendableValue = "lendableValue";
            $ctrl.loan.excess = "excess";
            $ctrl.loan.deficit = "deficit";
            $ctrl.loan.lenderName = "lenderName";
            $ctrl.loan.lenderAddress = "lenderAddress";
            loanService.selectedAccountList.forEach(function(account){
                if(account.selected){
                    $ctrl.loan.collateralAccountIds.push(account.id);           
                } 
            });

        }

        $ctrl.saveLoan = function() {
            setMockValuesForNewLoan();
            loanService.saveLoanData($ctrl.loan).then(function(response) {
                if (response.data.success) {
                    $location.hash('form-message');
                    $ctrl.loan.id = response.data.loanId;
                    //Fetching borrowerID on ctreation of loan
                    $ctrl.loan.borrowerId = response.data.borrowerId;
                    $ctrl.successFlag = true;
                    $ctrl.successMsg.value = "Congratulations ! Loan with ID "+ $ctrl.loan.id+
                                        " has been saved successfully for borrower with ID as "+$ctrl.loan.borrowerId+
                                        " Click on send to consent button to proceed.";
                    /*$timeout(function() {
                        $ctrl.successFlag = false;
                    }, 10000);*/
                }
            }, function(err) {
                console.log(err);
                $location.hash('form-message');
                $ctrl.errorFlag = true;
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 5000);
            });
        };

        $ctrl.sendConsent = function() {
            var reqObj = {
                loanId : $ctrl.loan.id,
                action : $ctrl.userActions.financialAdvisor
            };

            loanService.sendConsent(reqObj).then(function(response) {
               if (response.data.success && response.data.success === true) {

                    $ctrl.successFlag = true;
                    $ctrl.successMsg.value = "Loan with ID "+ $ctrl.loan.id+" has been successfully sent for acknowledgement";
                    //$ctrl.navigateTo('LoanListing');
                }
            }, function(err) {
                console.log(err);
                $ctrl.errorFlag = true;
                $location.hash('form-message');
                $timeout(function() {
                    $ctrl.errorFlag = false;
                }, 10000);
            });
        };

        $ctrl.enableLoanSubmissionButton = function() {
            $ctrl.disableDraftButton = $ctrl.disableConsentButton = false;
        };

        $rootScope.$broadcast('navButton', { status: true });

    };

    loandetailsController.$inject = ['loanService', 'EntityMapper', 'Loan', '$timeout', '$rootScope',
        '$anchorScroll', '$location', '$router', 'LoanStatus', 'userService'
    ];

    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'loandetails/loandetails.html',
        controller: loandetailsController,        
        $canActivate: [
            '$nextInstruction',
            '$prevInstruction',
            'userService',
            '$router',
            function($nextInstruction, $prevInstruction, userService,
                $router) {
                if (userService.isAnonymous() === true) {
                    $router.navigate(['Login']);
                    return false;
                } else {
                    return true;
                }
            }
        ]
    };

    module.exports = angular.module('loandetails').component('loanDetails',
        componentConfig);

})();

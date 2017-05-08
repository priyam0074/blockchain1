'use strict';

(function() {
    /*
     *  loanService
     *  Description
     *  loanService fetches and performs on the Loan Data.
     */

    angular.module('core.services')
        .service('loanService', ['$q', '$http',
            function($q, $http) {
                var baseApiUrl = '/api';
                var REQUEST_URL = {
                    getUsesOfLoanProceeds: baseApiUrl + '/getUsesOfLoanProceeds',
                    getCurrentRate: baseApiUrl + '/getCurrentRate',
                    getCollateralAccountList: baseApiUrl + '/getCollateralAccountList/{borrowerPhNum}',
                    getAccountSecurities: baseApiUrl + '/getAccountSecurities',
                    saveLoanData: baseApiUrl + '/saveLoanData',
                    getLoanList: baseApiUrl + '/getLoanList',
                    getLoanDetails: baseApiUrl + '/getLoanDetails/{loanId}',
                    getLoanDetailsForBorrower: baseApiUrl + '/getLoanDetailsForBorrower/{loanId}',
                    acknowledgeLoanData: baseApiUrl + '/acknowledgeLoanData',
                    approveLoanData: baseApiUrl + '/approveLoanData',
                    sendConsent: baseApiUrl + '/sendConsent',
                    getLoanListBorrower : baseApiUrl + '/getLoanListBorrower/{borrowerID}',
                    getAccountSecuritiesOnCreate : baseApiUrl + '/getAccountSecuritiesOnCreate',
                    getExistingBorrowerDetails: baseApiUrl+'/getExistingBorrowerDetails/{phone}',
                    withdrawAmount: baseApiUrl+ '/withdrawAmount'
                };

                var LOAN_STATES = {
                    'pendingConsent': 'pendingConsent',
                    'pendingAcknowledgement': 'pendingAcknowledgement',
                    'pendingApproval': 'pendingApproval',
                    'approved': 'approved'
                };

               

                function getUsesOfLoanProceeds() {
                    return $http.get(REQUEST_URL.getUsesOfLoanProceeds);
                }

                function getCurrentRate() {
                    return $http.get(REQUEST_URL.getCurrentRate);
                }

                function getCollateralAccountList(borrowerPhNum) {
                    return $http.get(REQUEST_URL.getCollateralAccountList.replace('{borrowerPhNum}',borrowerPhNum));
                }

                function getAccountSecurities(params) {
                    return $http.post(REQUEST_URL.getAccountSecurities, params);
                }

                function getAccountSecuritiesOnCreate(params){
                   return $http.post(REQUEST_URL.getAccountSecuritiesOnCreate, params);
                }

                function saveLoanData(loanData) {
                    return $http.post(REQUEST_URL.saveLoanData, loanData, null);
                }
                function approveLoanData(req) {
                    return $http.post(REQUEST_URL.approveLoanData, req, null);
                }
                
                function acknowledgeLoanData(req) {
                    return $http.post(REQUEST_URL.acknowledgeLoanData, req, null);
                }

                function sendConsent(req) {
                    return $http.post(REQUEST_URL.sendConsent, req, null);
                }

                function getLoanList(user) {
                    if(user.userRole === "borrower"){
                        return $http.get(REQUEST_URL.getLoanListBorrower.replace('{borrowerID}', user.usedId));
                    }
                    else{
                        return $http.get(REQUEST_URL.getLoanList, { params: user });
                    }
                }

                function getExistingBorrowerDetails(params){
                    return $http.get(REQUEST_URL.getExistingBorrowerDetails.replace('{phone}',params.phone));
                }

                function getLoanDetails(loanId) {
                    var params = {};
                    params.loanId = loanId;
                    return $http.get(REQUEST_URL.getLoanDetails.replace('{loanId}', loanId));
                }

                function getLoanDetailsForBorrower(loanId) {
                    var params = {};
                    params.loanId = loanId;
                    return $http.get(REQUEST_URL.getLoanDetailsForBorrower.replace('{loanId}', loanId));
                }

                
                function withdrawAmount(withdrawData) {
                    return $http.post(REQUEST_URL.withdrawAmount, withdrawData, null);
                }


                function calculateTotalCollateralAmount(collateralPositions) {
                    var totalCollateralAmount = 0;
                    collateralPositions.forEach(function(position) {
                        totalCollateralAmount += Number.parseInt(position.collateralValue);
                    });
                    return totalCollateralAmount;
                }

                function getLoanStates() {
                    return LOAN_STATES;
                }

                return {
                    getUsesOfLoanProceeds: getUsesOfLoanProceeds,
                    getCurrentRate: getCurrentRate,
                    getCollateralAccountList: getCollateralAccountList,
                    getAccountSecurities: getAccountSecurities,
                    getAccountSecuritiesOnCreate : getAccountSecuritiesOnCreate,
                    saveLoanData: saveLoanData,
                    getLoanList: getLoanList,
                    getLoanDetails: getLoanDetails,
                    getLoanDetailsForBorrower:getLoanDetailsForBorrower,
                    getExistingBorrowerDetails:getExistingBorrowerDetails,
                    calculateTotalCollateralAmount: calculateTotalCollateralAmount,
                    getLoanStates: getLoanStates,
                    approveLoanData: approveLoanData,
                    acknowledgeLoanData: acknowledgeLoanData,
                    sendConsent: sendConsent,
                    loanAmount: 0,
                    collateralAccountList: [],
                    selectedAccountList: [],
                    withdrawAmount:withdrawAmount
                };
            }
        ]);

})();

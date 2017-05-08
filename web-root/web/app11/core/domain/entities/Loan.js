'use strict';

(function() {

    angular.module('core.domain')
        .factory('Loan', ['EntityMapper', 'Person', 'CollateralAccount', 'CollateralPosition', function(EntityMapper, Person, CollateralAccount, CollateralPosition) {
            var Loan = function(data) {
                if (data instanceof Object) {
                    this.id = data.id;
                    this.loanAmount = data.loanAmount;
                    this.useOfLoanProceeds = data.useOfLoanProceeds;
                    this.rateOfInterest = data.rateOfInterest;
                    this.libor = data.libor;
                    this.spread = data.spread;
                    this.status = data.status ? data.status.replace(/[^a-z\.]+/gi, ""):null;
                    this.status = data.status;
                    this.isActive = data.activestatus;
                    this.creditLimit = data.creditLimit;
                    this.outstanding = data.outstanding;
                    this.creditLineExcess = data.creditLineExcess;
                    this.amountAvailableToBorrow = data.amountAvailableToBorrow;
                    this.marginCallAmount = data.marginCallAmount;
                    this.marginCallDueDate = data.marginCallDueDate;
                    this.marketValue = data.marketValue;
                    this.lendableValue = data.lendableValue;
                    this.collateralValue = data.collateralValue;
                    this.excess = this.excess;
                    this.deficit = this.deficit;
                    this.lenderName = data.lenderName;
                    this.lenderAddress = data.lenderAddress;

                    this.collateralAccounts = new EntityMapper(CollateralAccount).toEntities(data.collateralAccounts);
                    this.collateralPositions = new EntityMapper(CollateralPosition).toEntities(data.collateralPositions);
                    this.collateralAccountIds = data.collateralAccountIds || [];

                    this.borrower = new EntityMapper(Person).toEntity(data.borrower);
                    this.custodian = new EntityMapper(Person).toEntity(data.custodian);
                    this.broker = new EntityMapper(Person).toEntity(data.broker);
                }
            };

            Loan.prototype = {

            };

            return Loan;
        }]);

})();

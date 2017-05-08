'use strict';

(function() {

    var loanlistingController = function(loanService, EntityMapper, Loan, LoanSecurity, userService, $router) {

        var $ctrl = this;
        $ctrl.addedRows = [];
        $ctrl.updatePrice = false;
        var user = userService.getLoggedInUser();

        loanService.getLoanList({ usedId: user.id, userRole: user.roles[0].role }).then(function(response) {

            $ctrl.loanList = new EntityMapper(Loan).toEntities(response.data.loanList);

        }, function() {});

        $ctrl.navigateToLoanDetails = function(loanId) {
            $router.navigate(['LoadLoanDetails', { id: loanId }]);
        };
        $ctrl.mockedData =[  
             {  
                "id":"GOOGLE1",
                "security":"GOOGLE",
                "PRICE":"1000"
            }, {  
                "id":"YAHOO1",
                "security":"YAHOO",
                "PRICE":"1000"
            }, {  
                "id":"oppo1",
                "security":"oppo",
                "PRICE":"1000"
            }, {  
                "id":"fabindia1",
                "security":"fabindia",
                "PRICE":"1000"
             }
           ];
        $ctrl.heading ={
            "security": "select security",
            "securityName": "securityName",
            "PRICE": "PRICE",
            "NEW": "NEW PRICE",
            "none": "None",
            "delete":"Remove",
            "update": "Update",
            "action": "Action"
        };

        $ctrl.addRow = function() {
            $ctrl.dropdownvalues = [];
            loanService.readSecurities().then(function(response){
                $ctrl.securitiesList = new EntityMapper(LoanSecurity).toEntities(response.data.securitiesList);
                $ctrl.securitiesList.forEach(function(item){
                $ctrl.dropdownvalues.push(item.name);
                });

                $ctrl.inserted = {
                  dropdownValues:$ctrl.dropdownvalues,
                  id: '' ,
                  name: '',
                  price: null,
                  editPrice: true
                };
                $ctrl.updatePrice = true;
                $ctrl.addedRows.push($ctrl.inserted);
                 return $ctrl.addedRows;
            });
            /*loanService.readSecurities().then(function(response){
            $ctrl.securitiesList = new EntityMapper(LoanSecurity).toEntities(response.data.securitiesList);
             });
*/ 
      };
    
        $ctrl.filterSecId = function(row) {
           
          if(row.dropdownValue !== undefined && row.dropdownValue !== null){
             for(var i = 0; i< $ctrl.securitiesList.length; i++) {
                      
                    if($ctrl.securitiesList[i].name === row.dropdownValue) {
                        row.id = $ctrl.securitiesList[i].id ;
                        row.security= $ctrl.securitiesList[i].name;
                        row.PRICE= $ctrl.securitiesList[i].price;
                        row.newprice= row.newprice;
                        row.editPrice = false;
                }
        } 
             return row;
            }
            else if(row.dropdownValue === null){
                        row.id = '';
                        row.name= ''
                        row.price= null;
                        row.newprice= null;
                        row.editPrice = true;
                        return row;
        
            }
            else {
                return $ctrl.addedRows;
            }
    };  
    // delete row
        $ctrl.Delete = function(row) {
            var index = $ctrl.addedRows.indexOf(row);
            $ctrl.addedRows.splice(index, 1);
        }; 
    // update price
        $ctrl.Update = function() {
            var UpdatedSecurity = {
                id: '',
                newprice: null
            };
            var UpdatedSecurityList = [];
            if($ctrl.addedRows.length !== 0) {
            $ctrl.addedRows.forEach(function(item){
                UpdatedSecurity.id = item.id;
                UpdatedSecurity.newprice =item.newprice;
            });
            UpdatedSecurityList.push(UpdatedSecurity);
            loanService.updateSecurityPrice(UpdatedSecurityList);
        }
        }; 
    };

    loanlistingController.$inject = ['loanService', 'EntityMapper', 'Loan', 'LoanSecurity', 'userService', '$router'];


    var componentConfig = {
        // isolated scope binding
        bindings: {
            loanInfo: '<'
        },
        templateUrl: 'loanlisting/loanlisting.html',
        controller: loanlistingController,
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

    module.exports = angular.module('loanlisting')
        .component('loanListing', componentConfig);

})();

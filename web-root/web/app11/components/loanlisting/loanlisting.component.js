'use strict';

(function() {

    var loanlistingController = function(loanService, EntityMapper, Loan, userService, $router) {

        var $ctrl = this;

        var user = userService.getLoggedInUser();

        loanService.getLoanList({ usedId: user.id, userRole: user.roles[0].role }).then(function(response) {

            $ctrl.loanList = new EntityMapper(Loan).toEntities(response.data.loanList);

        }, function() {});

        $ctrl.navigateToLoanDetails = function(loanId) {
            $router.navigate(['LoadLoanDetails', { id: loanId }]);
        };
        $ctrl.lov_state = [
        {
        "id": "GOOGLE1",
         "security" : "GOOGLE",
          "PRICE" : "1000",
          "NEWPRICE" : "10002",
           "editing": false},
        {"id": "YAHOO1", 
         "security" : "YAHOO",
          "PRICE" : "1000",
          "NEWPRICE" : "10002",
         "editing": false
     },
        {"id": "oppo1",
        "security" : "oppo",
          "PRICE" : "1000",
          "NEWPRICE" : "10002",
       "editing": false
   },
        {  "id": "fabindia1",
          "security" : "fabindia",
          "PRICE" : "1000",
          "NEWPRICE" : "10002",
       "editing": false}
    ];
    $ctrl.heading ={
    "security": "security",
    "PRICE": "PRICE",
    "NEW": "NEW PRICE",
    }
     $ctrl.editItem = function (item) {
        item.editing = true;
    }
    $ctrl.addedRow = [];
     $ctrl.addUser = function() {
       $ctrl.inserted = {
         'id': '' ,
         'security': '',
         'PRICE': null,
         'NEWPRICE': null,
         'editing':false
    };
    //$ctrl.count= 0;
    $ctrl.count = 1;
         return $ctrl.inserted;
        //$ctrl.addedRow.push($ctrl.inserted);
  };
    $ctrl.doneEditing = function (item) {
        item.editing = false;
        //dong some background ajax calling for persistence...
    };
   /* $ctrl.saveColumn = function(column) {
    
    angular.forEach$ctrl.lov_state, function(user) {
      delete result.NEWPRICE;
      result
    })
    return $q.all(results);
  };*/
  $ctrl.mom = function(){
    for(var i = 0; i< $ctrl.lov_state.length; i++) {
          if($ctrl.lov_state[i].id === $ctrl.selectedQuery) {
           $ctrl.inserted = {
               'id': $ctrl.lov_state[i].id ,
               'security': $ctrl.selectedQuery,
               'PRICE': $ctrl.lov_state[i].PRICE,
               'NEWPRICE': $ctrl.lov_state[i].NEWPRICE,
               'editing':false  
           };
          $ctrl.addedRow.push($ctrl.inserted);
          }
       
         }
  }
   var dd = [];
   var cc = [];
    $ctrl.filterSecId = function() {
        var result = [];
       // $ctrl.addedRow = [];
        //console.log($ctrl.selectedQuery);
        if(ctrl.count !=0){
        $ctrl.mom();
         }
      if($ctrl.count >=1){

         if( $ctrl.selectedQuery === undefined || $ctrl.selectedQuery === null ) {
            $ctrl.addedRow.push($ctrl.inserted);
            $ctrl.count = 0;
            dd.push($ctrl.addedRow);
            return dd;
         }
        else {
            $ctrl.count = 0;
            cc.push($ctrl.addedRow);
            return cc;
        }
    }  
    };    
    };

    loanlistingController.$inject = ['loanService', 'EntityMapper', 'Loan', 'userService', '$router'];


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

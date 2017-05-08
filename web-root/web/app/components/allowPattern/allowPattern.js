"use strict";

(function() {
angular.module('sblocloader')
.directive('allowPattern', [allowPatternDirective]);
                                   
function allowPatternDirective() {
  var msg = "no sufficient amount to withdraw";
  var tpl = '<input type="text" placeholder="enter amount to be withdrawn" ng-model="$ctrl.abc" />' +
            '<p  class="label label-danger" ng-if="$ctrl.outstanding < $ctrl.abc ">' + msg + 
            '</p>'
    return {
        restrict: "E",
        template: tpl,
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
              var allowPattern = "^[0-9]*\.?[0-9]+$"; 
                var tempKeyCodeChar="";
              element.bind("keypress", function(event) {
              var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
        
       
               var keyCodeChar = String.fromCharCode(keyCode);
               tempKeyCodeChar=tempKeyCodeChar.concat(keyCodeChar);
          
               keyCodeChar=tempKeyCodeChar;
          
          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
          console.log(new RegExp(allowPattern).test(+keyCodeChar));
            if (!(new RegExp(allowPattern).test(+keyCodeChar))) {
            tempKeyCodeChar = tempKeyCodeChar.substring(0,tempKeyCodeChar.length-1);
            event.preventDefault();
             return false;
              }

         
             });
           };
       }
    };
}

})();

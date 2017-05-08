
"use strict";

(function() {
angular.module('sblocloader')
  .directive('loading', ['$http', function ($http) {
    return {
      restrict: 'E',
      template:'<div>'+
                 '<div class="loader-position">'+
                    '<span></span>'+
                  '</div>'+
                '</div>',
      link: function (scope, element) {
        scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function (value) {
          if (value) {
            element.removeClass('ng-hide');
          } else {
            element.addClass('ng-hide');
          }
        });
      }
    };
}]);
})();
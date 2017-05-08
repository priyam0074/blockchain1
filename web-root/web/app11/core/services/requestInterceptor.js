'use strict';

(function() {
    /*
     *   requestInterceptor
     *   Description
     *   requestInterceptor intercepts are responses and error responses and
     *   redirects to respective Error Pages
     */

    angular.module('core.services')
        .factory('requestInterceptor', ['$q', '$rootScope', '$injector', '$router',
            function($q, $rootScope, $injector, $router) {
                var AUTH_ERROR = [401, 403]; // Authentication Errors

                function request(config) {
                    var userService = $injector.get('userService');

                    if (!userService.isAnonymous()) {
                        config.headers['x-access-token'] = userService.getToken();
                    }
                    return config;
                }

                function requestError(rejection) {
                    return rejection;
                }

                function response(response) {
                    return response;

                }

                function responseError(rejection) {
                    redirectOnError(rejection);
                    return $q.reject(rejection);
                }

                function redirectOnError(res) {
                    var isAuthError = false;

                    AUTH_ERROR.filter(function(error) {
                        if (error === res.status) {
                            isAuthError = true;
                            return;
                        }
                    });

                    $rootScope.errorState = {
                        'status': res.status,
                        'statusText': res.statusText
                    };

                    if (isAuthError === true) {
                        $router.navigate(['Error']);
                    } else {
                        $router.navigate(['Login']);
                    }
                }

                return {
                    request: request,
                    requestError: requestError,
                    response: response,
                    responseError: responseError
                };
            }
        ]);

})();

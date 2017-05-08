'use strict';

(function() {
    /*
     *	userService
     *	Description
     *	userService fetches and performs on the User Data.
     */

    angular.module('core.services')
        .service('userService', ['$q', '$http', '$cookies', '$rootScope', 'User', 'EntityMapper',
            function($q, $http, $cookies, $rootScope, User, EntityMapper) {
                var baseApiUrl = '/api';
                var urls = {
                    login: baseApiUrl + '/authenticate',
                    logout: baseApiUrl + '/logout'
                };

                var USER_ROLES = {
                    'borrower': 'borrower',
                    'financialAdvisor': 'financialAdvisor',
                    'lender': 'lender'
                };

                var USER_ACTIONS = {
                    'lender': 'approve',
                    'borrower': 'acknowledge',
                    'financialAdvisor': 'sendForConsent'
                };

                function getLoggedInUser() {
                    //loads and return the logged in User from Cookies
                    return new EntityMapper(User).toEntity($cookies.getObject('loggedInUser'));
                }

                function resetUserCookie() {
                    $cookies.remove('loggedInUser');
                }

                function saveUserToCookies(user) {
                    $cookies.putObject('loggedInUser', user, {
                        expires: user && user.tokenExpiry && new Date(Date.now() + user.tokenExpiry * 1000)
                    });
                }

                function login(loginInfo) {
                    var defferedObj = $q.defer();
                    loginInfo.grant_type = 'password';
                    $http({
                        method: 'post',
                        url: urls.login,
                        data: $.param(loginInfo), // data needs to be in url encoded format
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'charset': 'UTF-8'
                        },
                        withCredentials: true
                    }).then(function(response) {
                        if (response && response.data.success === true) {
                            // save User to Cookies
                            saveUserToCookies(new User(response.data));
                            defferedObj.resolve(response && response.data);
                            $rootScope.$broadcast('login', {});
                        } else {
                            resetUserCookie();
                            defferedObj.reject(response && response.data);
                        }
                    }, function(rejection) {
                        resetUserCookie();
                        defferedObj.reject(rejection);
                    });

                    return defferedObj.promise;
                }

                function logout() {
                    var defferedObj = $q.defer();

                    $http({
                        method: 'post',
                        url: urls.logout,
                        data: getLoggedInUser(),
                        headers: {
                            'content-type': 'application/json'
                        }
                    }).then(function(response) {
                        resetUserCookie();
                        defferedObj.resolve(response.data);
                    }, function(rejection) {
                        defferedObj.reject(rejection);
                    });

                    return defferedObj.promise;
                }

                function isAnonymous() {
                    var currentUser = getLoggedInUser();
                    return currentUser && currentUser.token ? false : true;
                }

                function getToken() {
                    var currentUser = getLoggedInUser();
                    return currentUser && currentUser.token;
                }

                function getUserRoles() {
                    return USER_ROLES;
                }

                function getUserActions() {
                    return USER_ACTIONS;
                }
                return {
                    login: login,
                    logout: logout,
                    getLoggedInUser: getLoggedInUser,
                    isAnonymous: isAnonymous,
                    getToken: getToken,
                    getUserRoles: getUserRoles,
                    getUserActions: getUserActions
                };
            }
        ]);

})();

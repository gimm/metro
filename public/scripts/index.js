'use strict';

define([], function () {


    var app = angular.module('metroApp', [
        'ngRoute', 'ngResource', 'ngCookies', 'metro.controller', 'metro.service', 'metro.directive'
        ])
        .config(function ($routeProvider, $locationProvider, $httpProvider) {
            //set xhr to true
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            $locationProvider.html5Mode(true);
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl',
                    resolve: {
                        loadTiles: ['$resource', '$timeout', 'metro', function ($resource, $timeout, metro) {
                            return metro.load();
//                        return $resource('/app/').query();
                        }]
                    }
                })
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                }).when('/sign', {
                    templateUrl: 'views/sign.html',
                    controller: 'SignCtrl'
                })
                .otherwise({
                    templateUrl: '/views/404.html',
                    resolve: {
                        load: function ($q, $injector, $rootScope) {
                            var app = window.location.pathname.split('/')[1],
                                defer = $q.defer();
                            require(['../apps/' + app + '/' + app], function (module) {
                                $injector.loadNewModules([module.name]);
                                console.log('module loaded', module.name);
                                defer.reject({
                                    name: 'NeedReload',
                                    message: 'load-module'
                                });
                            }, function (err) {
                                console.log('load err', err);
                                $rootScope.$broadcast('metroError', {
                                    name: 'ModuleLoadFailed',
                                    message: 'load-module-failed'
                                });
                                defer.resolve();
                            });
                            return defer.promise;
                        }
                    }
                });
        }).run(function ($rootScope, $route) {
            $rootScope.$on('$routeChangeError', function (e, next, prev, err) {
                console.log('route error');
                if(err.message === 'load-module' && !angular.equals(next, prev)){
                    $route.reload();
                }
            });
            $rootScope.$on('metroError', function (event, error) {
                $rootScope.error = error;
            });

            $rootScope.clicked = function () {
                console.log('clicked...');
            };
        });
    return app;
});

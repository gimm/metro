'use strict';

define([], function () {

    var app = angular.module('metroApp', [
        'ngRoute', 'ui.router', 'ngResource', 'ngCookies', 'metro.controller', 'metro.service', 'metro.directive'
        ])
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            //set xhr flag to true, in order to make the isXhr check work with express
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            $locationProvider.html5Mode(true);
            $urlRouterProvider
                .rule(function($injector, $location) {
                    var path = $location.path();
                    if (path != '/' && path.slice(-1) === '/') {
                        $location.replace().path(path.slice(0, -1));
                    }
                })
                .when('/index.html', '/')
                .otherwise(function ($injector, $location) {
                    console.log('url not match');
                    var app = $location.path().split('/')[1];

                    require(['/' + app + '/' + app + '.js'], function (app) {
                        console.log('module loaded', app.name);
                    }, function (err) {
                        console.log('load err', err);
                        $injector.invoke(function ($state) {
                            $state.go('404', {message: err.message});
                        });
                    });
                    return false;
            });

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/views/main.html',
                    controller: 'MainCtrl',
                    resolve: {
                        loadTiles: ['$resource', '$timeout', 'metro', function ($resource, $timeout, metro) {
                            return metro.load();
                        }]
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .state('sign', {
                    url: '/sign',
                    templateUrl: 'views/sign.html',
                    controller: 'SignCtrl'
                })
                .state('404', {
                    templateUrl: '/views/404.html',
                    params: ['message'],
                    controller: function($scope, $stateParams, $state){
                        $scope.message = $stateParams.message;
                    }
                })
                .state('app', {
                    templateUrl: '/views/wrapper.html'
                });

        }).run(function ($rootScope, $route, $state, $injector, $location, $urlRouter) {

            $rootScope.$on('metroError', function (event, error) {
                $rootScope.error = error;
            });

            $rootScope.clicked = function () {
                console.log('clicked...');
            };

        });
    return app;
});

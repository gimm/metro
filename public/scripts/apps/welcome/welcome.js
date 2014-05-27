'use strict';
define([], function () {
    var welcome = angular.module('welcome', [])
        .config(function ($routeProvider, $locationProvider, $httpProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider
                .when('/welcome/:name?', {//TODO create a customized route provider
                    templateUrl: '/scripts/apps/welcome/templates/home.html',
                    controller: 'HomeCtrl'
                })
                .when('/welcome/about', {
                    template: 'about welcome page!'
                })
        })
        .value('test', 'value from hello module')
        .controller('HomeCtrl', function ($scope, $routeParams) {
            $scope.name = $routeParams.name || 'Guest';
        });
    return welcome;
});


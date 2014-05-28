'use strict';
define([], function () {
    var welcome = angular.module('welcome', ['metro.service']);
    welcome.config(function (appRouteProvider) {
        appRouteProvider.app(welcome.name);
        appRouteProvider
            .when('/:name?', {//TODO create a customized route provider
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })
            .when('/about', {
                template: 'about welcome page!'
            })
    })
        .value('test', 'value from hello module')
        .controller('HomeCtrl', function ($scope, $routeParams) {
            $scope.name = $routeParams.name || 'Guest';
        });
    return welcome;
});


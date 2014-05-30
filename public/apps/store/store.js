'use strict';
define([], function () {
    var app = angular.module('store', ['metro.service']);
    app.config(function (appRouteProvider) {
        appRouteProvider.app(app.name);
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
    return app;
});


'use strict';
define(['metro'], function (metro) {
    return metro.app('welcome')
        .states(['home', 'about'])
        .module(function (app) {
            app.controller('HomeCtrl', function ($scope, $routeParams) {
                $scope.name = $routeParams.name || 'Guest';
            })
        })
        .init();
});


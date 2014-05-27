'use strict';
define([], function () {
    var hello = angular.module('settings', [])
        .config(function ($routeProvider, $locationProvider, $httpProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider
                .when('/settings', {
                    template: '<h1>route from settings module!!</h1>'
                });
        })
        .value('test', 'value from hello module');
    return hello;
});


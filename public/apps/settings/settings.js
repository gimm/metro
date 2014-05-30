'use strict';
define([], function () {
    var hello = angular.module('settings', [])
        .config(function (appRouteProvider) {
            appRouteProvider
                .app('settings')
                .when('/', {
                    templateUrl: 'templates/home.html'
                });
        })
        .value('test', 'value from hello module');
    return hello;
});


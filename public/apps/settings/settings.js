'use strict';
define([], function () {
    var hello = angular.module('settings', [])
        .config(function (appRouteProvider) {
            appRouteProvider
                .app('settings')
                .when('/', {
                    template: '<h1>route from settings module!!</h1>'
                });
        })
        .value('test', 'value from hello module');
    return hello;
});


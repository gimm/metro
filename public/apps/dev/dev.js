'use strict';
define(['metro'], function (metro) {
    return metro.app('dev', [])
            .states(['doc', 'app'])
            .module(function (app) {
                app.controller('DocCtrl', function ($scope, apps) {
                })
                .controller('AppCtrl', function ($scope, apps) {
                })
            })
        .init();
});


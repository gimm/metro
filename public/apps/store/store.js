'use strict';
define(['metro'], function (metro) {
    return metro.app('store')
        .states([{
            name: 'all',
            controller: 'AllCtrl'
        }, {
            name: 'my',
            controller: 'MyCtrl'
        }])
        .module(function (app) {
            app.value('apps', [
                {
                    id: 1,
                    title: 'weather1',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather2',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather3',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather4',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather5',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather6',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather7',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather8',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather9',
                    author: 'yuccwh@cn.ibm.com'
                },{
                    id: 1,
                    title: 'weather0',
                    author: 'yuccwh@cn.ibm.com'
                }
            ])
            .controller('AllCtrl', function ($scope, apps) {
                $scope.apps = apps;
            })
            .controller('MyCtrl', function ($scope, apps) {
                $scope.apps = apps;
            });
        })
        .init();
});


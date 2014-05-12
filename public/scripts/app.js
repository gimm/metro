'use strict';

angular.module('metroApp', [
        'ngRoute', 'ngResource', 'ngCookies'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        //set xhr to true
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    loadTiles: ['$resource', '$timeout', 'grid', function ($resource, $timeout, grid) {
                        return grid.load();
//                        return $resource('/app/').query();
                    }]
                }
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            }).when('/sign', {
                templateUrl: 'views/sign.html',
                controller: 'SignCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            }).when('/hello', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                template: '<div ng-include="templateUrl">Loading...</div>',
                controller: 'DynamicCtrl'
            });
    }).value('data', {
        'groups': [
            {
                'id': 1,
                'order': 2,
                'title': "Featured"
            },
            {
                'id': 2,
                'order': 1,
                'title': "New"
            },
            {
                'id': 3,
                'order': 3,
                'title': "Other"
            },
            {
                'id': 4,
                'order': 4,
                'title': "Test"
            }
        ],
        'tiles': [
            {
                id: "1",
                name: "1",
                order: 1,
                size: 2,
                group: 1
            },
            {
                id: "2",
                name: "2",
                order: 2,
                size: 1,
                group: 1
            },
            {
                id: "3",
                name: "2.5",
                order: 2.5,
                size: 1,
                group: 1
            },
            {
                id: "4",
                name: "3",
                order: 3,
                size: 2,
                group: 1
            },
            {
                id: "5",
                name: "4",
                order: 4.5,
                size: 1,
                group: 1
            },{
                id: "6",
                name: "5",
                order: 5,
                size: 1,
                group: 1
            },
            {
                id: "7",
                name: "6",
                order: 6,
                size: 2,
                group: 1
            },
            {
                id: "8",
                name: "7",
                order: 7,
                size: 2,
                group: 1
            },
            {
                id: "11",
                name: "Nokia Camera",
                order: 1,
                size: 2,
                group: 2
            },
            {
                id: "21",
                name: "Google Search",
                order: 2,
                size: 2,
                group: 2
            },
            {
                id: "31",
                name: "QQ",
                order: 3,
                size: 2,
                group: 2
            },
            {
                id: "41",
                name: "Evernote",
                order: 4,
                size: 2,
                group: 2
            },
            {
                id: "51",
                name: "Koding",
                order: 5,
                size: 2,
                group: 2
            }
            ,
            {
                id: "111",
                name: "Nokia Camera",
                order: 1,
                size: 2,
                group: 3
            },
            {
                id: "211",
                name: "Google Search",
                order: 2,
                size: 1,
                side: 'left',
                group: 3
            },
            {
                id: "311",
                name: "QQ",
                order: 2.5,
                size: 1,
                group: 3
            },
            {
                id: "411",
                name: "Evernote",
                order: 3,
                size: 2,
                group: 3
            },
            {
                id: "511",
                name: "Koding",
                order: 4,
                size: 2,
                group: 3
            },
            {
                id: "121",
                name: "Nokia Camera",
                order: 1,
                size: 2,
                group: 4
            },
            {
                id: "221",
                name: "Google Search",
                order: 2,
                size: 1,
                group: 4
            },
            {
                id: "321",
                name: "QQ",
                order: 2.5,
                size: 1,
                group: 4
            },
            {
                id: "421",
                name: "Evernote",
                order: 3,
                size: 2,
                group: 4
            },
            {
                id: "521",
                name: "Koding",
                order: 4,
                size: 2,
                group: 4
            }
        ]
    });

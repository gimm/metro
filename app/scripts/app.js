'use strict';

angular.module('metroApp', [
        'ngRoute'
    ])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    loadTiles: ['$q', '$timeout', 'grid', function ($q, $timeout, grid) {
                        return grid.load();
                    }]
                }
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                template: "view does not exist for this url!"
            });
    }).value('data', {
        'groups': [
            {
                'id': 1,
                'title': "Featured"
            },
            {
                'id': 2,
                'title': "New"
            },
            {
                'id': 3,
                'title': "Other"
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
                side: 'left',
                size: 1,
                group: 1
            },
            {
                id: "3",
                name: "2.5",
                order: 2,
                side: 'right',
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
                order: 4,
                size: 2,
                group: 1
            },{
                id: "6",
                name: "6",
                order: 5,
                size: 1,
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
                size: 1,
                side: 'left',
                group: 2
            },
            {
                id: "31",
                name: "QQ",
                order: 2,
                size: 1,
                side: 'right',
                group: 2
            },
            {
                id: "41",
                name: "Evernote",
                order: 3,
                size: 2,
                group: 2
            },
            {
                id: "51",
                name: "Koding",
                order: 3,
                size: 2,
                group: 2
            },
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
                order: 2,
                size: 1,
                side: 'right',
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
                order: 3,
                size: 2,
                group: 3
            }
        ]
    });

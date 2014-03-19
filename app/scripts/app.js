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
                name: "Sine News",
                coords: {x: 2, y: 0},
                size: 2,
                group: 1
            },
            {
                id: "2",
                name: "Yahoo Weather",
                coords: {x: 1, y: 2},
                group: 1
            },
            {
                id: "3",
                name: "App Store",
                coords: {x: 0, y: 0},
                group: 1
            },
            {
                id: "4",
                name: "Dropbox",
                coords: {x: 0, y: 1},
                size: 2,
                group: 1
            },
            {
                id: "5",
                name: "Codepen",
                coords: {x: 3, y: 1},
                group: 1
            },
            {
                id: "11",
                name: "Nokia Camera",
                coords: {x: 0, y: 0},
                size: 2,
                group: 2
            },
            {
                id: "21",
                name: "Google Search",
                coords: {x: 2, y: 0},
                group: 2
            },
            {
                id: "31",
                name: "QQ",
                coords: {x: 1, y: 1},
                group: 2
            },
            {
                id: "41",
                name: "Evernote",
                coords: {x: 2, y: 1},
                group: 2
            },
            {
                id: "51",
                name: "Koding",
                coords: {x: 2, y: 2},
                group: 2
            },
            {
                id: "111",
                name: "Nokia Camera",
                coords: {x: 0, y: 0},
                size: 2,
                group: 3
            },
            {
                id: "211",
                name: "Google Search",
                coords: {x: 3, y: 0},
                group: 3
            },
            {
                id: "311",
                name: "QQ",
                coords: {x: 1, y: 1},
                group: 3
            },
            {
                id: "411",
                name: "Evernote",
                coords: {x: 2, y: 1},
                group: 3
            },
            {
                id: "511",
                name: "Koding",
                coords: {x: 3, y: 2},
                group: 3
            }
        ]
    });
